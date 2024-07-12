'use client'
import { Avatar, Card, Textarea, Tooltip } from 'flowbite-react'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState, useRef, useContext} from 'react'
import { HiPaperAirplane } from "react-icons/hi";
import { BsEmojiSmile } from "react-icons/bs";
import ListFriend from './ListFriend';
import { Skeleton } from '@/components/ui/skeleton';
import "@/styles/scrollbar.css"
import Message from './Message';
import { AppContext } from '@/Context/Context';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MessageResponseType, UserData } from '@/types/type';
import { GetMessage } from '@/Services/message.api';
import { useToast } from '@/components/ui/use-toast';
import { url_img_default } from '@/images/image';
import { UserFindOne } from '@/Services/user.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getActiveStatus } from '@/Services/socket.api';
import { IoCall } from "react-icons/io5";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { SlOptionsVertical } from "react-icons/sl";
interface MessageInput {
  message: string;
}

export default function Chat() {
    const {toast} = useToast();
    const {user_id} = useContext(AppContext);
    const [current_friend, setCurrentFriend] = useState<UserData | null>(null);
    const [friend_status, setFriendStatus] = useState<number>(0);
    const messageBoxRef = useRef<HTMLDivElement>(null);
    const [row, setRow] =useState<number>(1);
    const {register, handleSubmit, reset, formState:{errors}, setValue} = useForm<MessageInput>();
    const isScrollingRef = useRef<NodeJS.Timeout | null>(null);
    const {socket} = useContext(AppContext);
    const [listMessage, setListMessage] = useState<Array<MessageResponseType>>([]);
    const queryClient = useQueryClient();
    const {data, isLoading, error} = useQuery({
        queryKey:['active_sts'],
        queryFn: ()=>getActiveStatus(current_friend?.id as number),
        enabled: !!current_friend,
    })
    
    useEffect(()=>{
        if(data && data.data) 
            setFriendStatus(data?.data?.data?.status);
    },[data])
    const getMessage = async() =>{
        try {
            if(user_id && current_friend){
                const messages = await GetMessage({user1:user_id, user2:current_friend?.id as number});
                if(messages) setListMessage(messages.data.data)
            }
            else return;
        } catch (error) {
            console.log(error);
        }
        
    }
    const handleScroll = () => {
        if (messageBoxRef.current) {
            if (isScrollingRef.current) {
                clearTimeout(isScrollingRef.current);
            }
            messageBoxRef.current.classList.remove('hide-scrollbar');
            isScrollingRef.current = setTimeout(() => {
                if (messageBoxRef.current) {
                    messageBoxRef.current.classList.add('hide-scrollbar');
                }
            }, 200);
        }
    };
    const setTimeScroll = () =>{
        
        const messageBox = messageBoxRef.current;
            if (messageBox) {
                messageBox.addEventListener('scroll', handleScroll);
                messageBox.classList.add('hide-scrollbar');
                messageBox.scrollTop = messageBox.scrollHeight;
            }
        return () => {
            if (messageBox) {
                messageBox.removeEventListener('scroll', handleScroll);
            }
            if (isScrollingRef.current) {
                clearTimeout(isScrollingRef.current);
            }
        };
    }
    setTimeout(()=>{
        setTimeScroll();
    },200)
    const handleEnterKey = (event: React.KeyboardEvent<HTMLTextAreaElement>)=>{
        let tempRow = row;
        setRow( tempRow + 1 );
        const textarea = event.target as HTMLTextAreaElement;
        const currentValue = textarea.value;
        const selectionStart = textarea.selectionStart || 0;
        const selectionEnd = textarea.selectionEnd || 0;
        const newValue =
            currentValue.substring(0, selectionStart) +
            '\n' +
            currentValue.substring(selectionEnd, currentValue.length);
        setValue('message', newValue);
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.altKey && !event.shiftKey){
            event.preventDefault();
            handleSubmit(onSubmit)();
        }
        else if (event.key === 'Enter' && event.shiftKey){
            let tempRow = row;
            setRow( tempRow + 1 );
            if(row >=6) setRow(6);
        }
        else if (event.key === 'Enter' && event.altKey){
            let tempRow = row;
            setRow( tempRow + 1 );
            handleEnterKey(event);
        }
        if (event.key === 'Backspace'){
            if(row === 1) return;
            const textarea = event.target as HTMLTextAreaElement;
            const selectionStart = textarea.selectionStart || 0;
            const currentLineStart = textarea.value.lastIndexOf('\n', selectionStart - 1) + 1;
            if (selectionStart === currentLineStart) {
                let tempRow = row;
                setRow(tempRow - 1);
            }
        }
    };
    useEffect(() => {
        if(socket){
            socket.on('onChat', async(data:any) => {
                queryClient.invalidateQueries({ queryKey:['list friend']});
                if (data) {
                    if(current_friend && user_id){
                        const receivedByUser = data.data[0].Received_by;
                        const sendByUser = data.data[0].Send_by;
                        const notification = data.data[data.data.length-1];
                        const check = (sendByUser === user_id && receivedByUser === current_friend.id) || (sendByUser === current_friend.id && receivedByUser === user_id);
                        if(check)
                            setListMessage(data.data);
                        else {
                            const user = await UserFindOne(notification.Send_by);
                            if(user){
                                toast({
                                    title: user.data.data.display_name,
                                    description:notification.Message
                                })
                            }
                            else return;
                        }   
                    }
                }
            });
            return () => {
                socket.off('onChat');
            };
        }
    }, [current_friend, user_id,socket]);
    useEffect(()=>{
        if(user_id && current_friend?.id){
            getMessage();
        }
    },[current_friend])
    useEffect(() => {
        const input = document.querySelector('textarea')
        input?.focus()
        if (!current_friend) {
            const friend:UserData|null = JSON.parse(localStorage.getItem('friend') as string);
            setCurrentFriend(friend);
        }
    }, [current_friend]);

    const onSubmit: SubmitHandler<MessageInput> = (data) => {
        if(!data.message || data.message.trim() === '') return;
        socket.emit('chat', {
            sendBy: user_id,
            message: data.message,
            receivedBy: current_friend?.id
        });
        setTimeScroll();
        reset();
        setRow(1);
    };
    
    return (
        <div className='flex space-x-1 '>
            <Card className='w-6xl h-[51rem] flex-col flex-1'>
                {(listMessage || !current_friend) && 
                <div className='w-full flex dark:bg-slate-700 relative top-0 p-2 rounded-sm dark:text-white bg-slate-100 text-black items-center'>
                    <div className='flex flex-1'>
                        <Avatar size={'xs'} alt='AV' img={current_friend?.avatar as any || url_img_default} rounded status="online" statusPosition="top-right" />
                        <strong className='ml-2'>{current_friend ? current_friend?.display_name : <Skeleton className="h-4 w-[250px]" />}</strong>
                    </div>
                    <div className='flex items-center'>
                        <Tooltip className='w-[8rem] z-50' content="Cuộc gọi thoại">
                            <IoCall className='text-xl cursor-pointer hover:text-gray-500 transition-all mx-2'/> 
                        </Tooltip>
                        <Tooltip className='w-[8rem] z-50' content="Cuộc gọi video">
                            <HiMiniVideoCamera className='text-2xl cursor-pointer hover:text-gray-500 transition-all mx-2'/> 
                        </Tooltip>
                        <Tooltip className='w-[8rem] z-50' content="Thông tin cuộc trò truyện">
                            <SlOptionsVertical className='text-xl cursor-pointer hover:text-gray-500 transition-all mx-2'/> 
                        </Tooltip>
                    </div>
                </div>
                }
                <div
                    ref={messageBoxRef}
                    className='message-box h-[48rem] dark:bg-slate-600 w-full rounded-sm px-2 flex flex-col overflow-auto'
                >
                    {listMessage && listMessage.map((message:MessageResponseType)=>{
                        return(
                            <Message key={message?.id} message={message.Message} createAt={message.createdAt} me={message.Send_by === user_id} status={friend_status} avatar={current_friend?.avatar}/>
                        )
                    })}
                    {!listMessage && 
                        <div className='mx-auto mt-60 flex flex-col'>
                            <span className='text-3xl'>Bạn chưa nhắn tin với ai</span>
                            <Button className='mx-auto my-1'>Trò chuyện ngay</Button>
                        </div>
                    }
                </div>
                {(listMessage || !current_friend) && 
                <form className='flex space-x-1 w-full mb-1' onSubmit={handleSubmit(onSubmit)}>
                    <Button size={'icon'} className='h-full bg-transparent shadow-none text-yellow-300 hover:bg-transparent'><BsEmojiSmile className='text-3xl' /></Button>
                    <Textarea onKeyDown={handleKeyDown} {...register("message",{required:true})} className='w-11/12 flex-1 no-resize' rows={row} placeholder="Tin nhắn..." />
                    <Button size={'icon'} type='submit' className='h-full'><HiPaperAirplane className='text-2xl' /></Button>
                </form>
                }
            </Card>
            <ListFriend setFriend={setCurrentFriend} friend={current_friend}/>
        </div>
    );
}
