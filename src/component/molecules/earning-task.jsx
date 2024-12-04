import AtomLabel from "../atom/atom-label";
import TaskList from "../atom/task-list";
import { taskFilter } from "../../utils/globals";
import { useState } from "react";

const EarningTask = () => {
    const [filter, setFilter] = useState(0);
    
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <AtomLabel content={"Tasks"} />
                {
                    taskFilter.map((_filter, _index) => 
                        <div onClick={() => setFilter(_index)} key={_index} className={`rounded-lg px-3 text-[14px] font-medium ${filter == _index ? 'bg-white text-main' : 'bg-[#FFFFFF33] text-white'}`}>{_filter}</div>
                    )
                }
            </div>
            <TaskList filter={filter} />
        </div>
    )
}

export default EarningTask;