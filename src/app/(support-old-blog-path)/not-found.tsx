export default function NotFound() {
  return (
    <div className='flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center md:flex-row md:space-x-6'>
      <div className='space-x-2 pt-6 pb-8 md:space-y-5'>
        <h1 className='font-extrabold text-6xl text-gray-900 leading-9 tracking-tight md:border-r-2 md:px-6 md:text-8xl md:leading-14 dark:text-gray-100'>
          404
        </h1>
      </div>
      <div className='max-w-md'>
        <p className='mb-4 text-center font-bold text-base leading-normal md:text-xl'>
          博客进行过迁移，但 tag/category 页并没有
          <br />
          <br />
          或许你可以点击上方导航栏看看有没有你在找的标签或分类？
        </p>
        {/*<p className="mb-8">别乱跑！否则就回不去了哦~</p>*/}
        {/*<Link*/}
        {/*  href="/"*/}
        {/*  className="focus:shadow-outline-blue inline rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow-sm transition-colors duration-150 hover:bg-blue-700 focus:outline-hidden dark:hover:bg-blue-500"*/}
        {/*>*/}
        {/*  我要回去！*/}
        {/*</Link>*/}
      </div>
    </div>
  )
}
