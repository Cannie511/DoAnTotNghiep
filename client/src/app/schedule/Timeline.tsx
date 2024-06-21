import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight, HiCalendar } from "react-icons/hi";

export default function TimeLine() {
  return (
    <div className="m-5">
        <Timeline>
        <Timeline.Item>
            <Timeline.Point icon={HiCalendar} />
            <Timeline.Content>
            <Timeline.Time>19/07/2024 00:30</Timeline.Time>
            <Timeline.Title>Khởi hành đi Đà Lạt</Timeline.Title>
            <Timeline.Body>
               00:30 sáng 19/07 xe bắt đầu lăn bánh đi Đà Lạt dự kiến đến nơi là 7h sáng 
            </Timeline.Body>
            <Button color="gray">
                Learn More
                <HiArrowNarrowRight className="ml-2 text-xl" />
            </Button>
            </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
            <Timeline.Point icon={HiCalendar} />
            <Timeline.Content>
            <Timeline.Time>19/07/2024 07:30</Timeline.Time>
            <Timeline.Title>Đên Đà Lạt, bắt đầu ăn sáng</Timeline.Title>
            <Timeline.Body>
                Tới nơi xe dừng chân để mọi người ăn sáng với bánh căn, và cà phê sáng
            </Timeline.Body>
            </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
            <Timeline.Point icon={HiCalendar} />
            <Timeline.Content>
            <Timeline.Time>19/07/2024 09:30</Timeline.Time>
            <Timeline.Title>Nhận phòng khách sạn</Timeline.Title>
            <Timeline.Body>
                Mọi người bắt đầu nhận phòng và check-in tại khách sạn Prime Lotus tại Đà Lạt
            </Timeline.Body>
            </Timeline.Content>
        </Timeline.Item>
        </Timeline>
    </div>
  )
}
