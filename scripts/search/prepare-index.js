import path from 'path'
import { promises as fs } from 'fs'

function parseFrontmatter(file) {
    const frontmatterMatch = file.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
    if(!frontmatterMatch) return { data: {}, content: file }

    const data = {}
    const lines = frontmatterMatch[1].split(/\r?\n/)
    let currentArrayKey = null

    for(const line of lines) {
        const arrayItemMatch = line.match(/^\s*-\s*(.*)$/)
        if(arrayItemMatch && currentArrayKey) {
            data[currentArrayKey].push(stripQuotes(arrayItemMatch[1]))
            continue
        }

        const pairMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
        if(!pairMatch) continue

        const [, key, rawValue] = pairMatch
        if(rawValue === '') {
            data[key] = []
            currentArrayKey = key
        } else {
            data[key] = stripQuotes(rawValue)
            currentArrayKey = null
        }
    }

    return { data, content: frontmatterMatch[2] }
}

function stripQuotes(value) {
    return value.trim().replace(/^['"]|['"]$/g, '')
}

(async function () {
    // prepare the dirs
    const srcDir = path.join(process.cwd(), 'src')
    const publicDir = path.join(process.cwd(), 'public')
    const contentBlogDir = path.join(srcDir, 'content', 'blog')
    const indexFile = path.join(publicDir, 'search-index.json')
    const getSlugFromPathname = (pathname) => path.basename(pathname, path.extname(pathname))
    const supportedExtensions = new Set(['.md', '.mdx', '.mdoc'])

    const contentFileNames = await fs.readdir(contentBlogDir)
    const contentFilePaths = contentFileNames
        .filter((fileName) => supportedExtensions.has(path.extname(fileName)))
        .map((fileName) => path.join(contentBlogDir, fileName))

    const files = contentFilePaths.map(async(filePath) => await fs.readFile(filePath, 'utf8'))
    const index = []
    let i = 0
    for await (let file of files){
        const { data: { title, description, tags = [] }, content } = parseFrontmatter(file)
        index.push({
            slug: getSlugFromPathname(contentFilePaths[i]),
            category: 'blog',
            title,
            description,
            tags,
            body: content
        })
        i++
    }
    await fs.writeFile(indexFile, JSON.stringify(index))
    console.log(`Indexed ${index.length} documents from ${contentBlogDir} to ${indexFile}`)

})();
