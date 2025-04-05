import { spawn } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
} from 'node:fs'

console.log(`
 /$$   /$$           /$$                           /$$$$$$$  /$$                    
| $$$ | $$          |__/                          | $$__  $$| $$                    
| $$$$| $$  /$$$$$$  /$$ /$$    /$$ /$$$$$$       | $$  \\ $$| $$  /$$$$$$   /$$$$$$ 
| $$ $$ $$ |____  $$| $$|  $$  /$$//$$__  $$      | $$$$$$$ | $$ /$$__  $$ /$$__  $$
| $$  $$$$  /$$$$$$$| $$ \\  $$/$$/| $$$$$$$$      | $$__  $$| $$| $$  \\ $$| $$  \\ $$
| $$\\  $$$ /$$__  $$| $$  \\  $$$/ | $$_____/      | $$  \\ $$| $$| $$  | $$| $$  | $$
| $$ \\  $$|  $$$$$$$| $$   \\  $/  |  $$$$$$$      | $$$$$$$/| $$|  $$$$$$/|  $$$$$$$
|__/  \\__/ \\_______/|__/    \\_/    \\_______/      |_______/ |__/ \\______/  \\____  $$
                                                                           /$$  \\ $$
                                                                          |  $$$$$$/
                                                                           \\______/ 
`)
console.log('Welcome to Naive Blog!')

const syncContentFromGit = async (contentDir) => {
  try {
    if (!process.env.GIT_URL) {
      console.log(
        'No GIT_URL found in environment variables, skipping content sync',
      )
      return
    }
    const gitUrl = process.env.GIT_URL
    await runBashCommand(
      `git clone --depth 1 --single-branch ${gitUrl} ${`${contentDir}/blog-tmp`}`,
    )
    console.log('✅ Synced content files from git successfully!')
    mkdirSync(`${contentDir}/blog`, { recursive: true })
    cpSync(`${contentDir}/blog-tmp/blog-posts/`, `${contentDir}/blog`, {
      recursive: true,
    })
    cpSync(
      `${contentDir}/blog-tmp/static/images/`,
      `${process.cwd()}/public/static/images`,
      {
        recursive: true,
      },
    )
    // 将 md 文件重命名为 mdx 文件
    const files = readdirSync(`${contentDir}/blog`, { recursive: true })
    for (const file of files) {
      if (file.endsWith('.md')) {
        renameSync(
          `${contentDir}/blog/${file}`,
          `${contentDir}/blog/${file.replace('.md', '.mdx')}`,
        )
      }
    }
    console.log('✅ Fetched content files from git successfully!')
  } finally {
    if (existsSync(`${contentDir}/blog-tmp`)) {
      rmSync(`${contentDir}/blog-tmp`, { recursive: true })
    }
  }
}

const runBashCommand = (command) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, [], { shell: true })

    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (data) => process.stdout.write(data))

    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (data) => process.stderr.write(data))

    child.on('close', (code) => {
      if (code === 0) {
        resolve(void 0)
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })

syncContentFromGit(`${process.cwd()}/data`)
