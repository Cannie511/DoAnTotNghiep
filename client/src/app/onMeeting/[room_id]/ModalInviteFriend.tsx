import { Modal, Tabs } from 'flowbite-react'
import React, { Dispatch, SetStateAction, useContext } from 'react'
import InviteFriendForm from './InviteFriendForm';
import UserInRoom from './UserInRoom';
import { AppContext } from '@/Context/Context';
interface Props{
    openModal:boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    room_id:number;
    host_id:number;
    userJoinList:Array<any>;
    removeUser: (user_id:number)=>void;
}
/**
 * Modal hiển thị để thêm người dùng nếu là host, còn người tham gia thì xem được danh sách tham gia
 * @param room_id: room_id
 * @returns 
 */
export default function ModalInviteFriend({openModal, setOpenModal, room_id, host_id, userJoinList,removeUser}:Props) {
    const {user_id} = useContext(AppContext);
  return (
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
        <Modal.Header />
        <Modal.Body>
            {/* check điều kiện host để render ra UI */}
            {
                user_id === host_id ? 
                <Tabs aria-label="Pills" className='mt-2' variant="pills">
                    <Tabs.Item active title="Danh sách người tham gia">
                        <UserInRoom host_id={host_id} listUserInRoom={userJoinList} room_id={room_id} removeUser={removeUser}/>
                    </Tabs.Item>
                    <Tabs.Item title="Mời người khác">
                        <InviteFriendForm setOpenModal={setOpenModal} room_id={room_id}/>
                    </Tabs.Item>
                </Tabs>
                :
                <UserInRoom host_id={host_id} listUserInRoom={userJoinList}/>
            }
        </Modal.Body>
      </Modal>
  )
}
