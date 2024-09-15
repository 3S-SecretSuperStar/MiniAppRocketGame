const UserInfoSkeleton = () => {
  return (
    <div className="flex   justify-between rounded-[10px] shadow bg-[#0000001A] py-2 px-4 items-center">

      <div className="animate-pulse flex gap-1 items-center">
        <div className="rounded-full bg-gray-300 h-8 w-8"></div>
        <div className="flex flex-col text-[14px] gap-1">
          <div className="h-3.5 w-48 bg-gray-300 rounded"></div>
          <div className="h-3.5 w-24 bg-gray-300 rounded"></div>
          <div className="h-3.5 w-12 bg-gray-300 rounded"></div>

        </div>
      </div>

      <div className="flex animate-pulse  items-center gap-2 text-[14px] font-medium">
        <div className="rounded-full bg-gray-300 h-6 w-6"></div>
        <div>
          <div className="h-3.5 w-8 bg-gray-300 rounded"></div>
        </div>
      </div>


    </div>
  )
}

export default UserInfoSkeleton