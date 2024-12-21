export default function NotFound() {
  return (
    <div className='flex min-h-[calc(100vh-5rem)] flex-col items-start justify-start md:flex-row md:items-center md:justify-center md:space-x-6'>
      <div className='space-x-2 pt-6 pb-8 md:space-y-5'>
        <h1 className='font-extrabold text-6xl text-gray-900 leading-9 tracking-tight md:border-r-2 md:px-6 md:text-8xl md:leading-14 dark:text-gray-100'>
          404
        </h1>
      </div>
      <div className='max-w-md'>
        <p className='mb-4 font-bold text-xl leading-normal md:text-xl'>
          博客进行过迁移，可能存在博文分页的偏移
          <br />
          <br />
          或许你可以搜索一下你想看的东西？
        </p>
      </div>
    </div>
  )
}
