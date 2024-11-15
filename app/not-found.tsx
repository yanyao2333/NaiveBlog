export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col justify-center items-center md:flex-row md:space-x-6">
      <div className="space-x-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-base text-center font-bold leading-normal md:text-xl">
          你来到了神隐之地
        </p>
        {/*<p className="mb-8">别乱跑！否则就回不去了哦~</p>*/}
        {/*<Link*/}
        {/*  href="/"*/}
        {/*  className="focus:shadow-outline-blue inline rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow transition-colors duration-150 hover:bg-blue-700 focus:outline-none dark:hover:bg-blue-500"*/}
        {/*>*/}
        {/*  我要回去！*/}
        {/*</Link>*/}
      </div>
    </div>
  )
}
