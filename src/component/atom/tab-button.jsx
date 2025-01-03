import { cn } from "../../utils";

const TabButton = ({className, tabList, tabNo, setTabNo }) => {
    return (
        <div className={cn(className,`flex w-full p-1 gap-1 justify-between rounded-xl text-base font-bold bg-main text-white`)}>
            {
                tabList.map((_tab, _index) => (
                    <div
                        className={`rounded-lg items-center py-1 w-1/2 ${tabNo === _tab.id && 'bg-mainFocus'}`}
                        onClick={() => setTabNo(_tab.id)}
                        key={_index}
                    >
                        <div className="flex gap-[6px] mx-auto w-fit items-center">
                            <img
                                src={`image/${_tab.src}`}
                                className="w-6 h-6"
                                alt="tab items"
                            />
                            <div>{parseFloat(_tab.amount).toFixed(2)}</div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default TabButton;