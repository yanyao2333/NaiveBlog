import rss from './contentUtils/rss.mjs'

async function postbuild() {
  await rss()
}

postbuild()
