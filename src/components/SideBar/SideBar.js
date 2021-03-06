import React, { Component } from 'react';
import FAChevronDown from 'react-icons/lib/md/keyboard-arrow-down'
import FAMenu from 'react-icons/lib/fa/list-ul'
import FASearch from 'react-icons/lib/fa/search'
import MdEject from 'react-icons/lib/md/eject'
import {SideBarOption} from './SideBarOption'
import {get ,last, differenceBy} from 'lodash'
import {createChatName} from '../../Factories'

export default class SideBar extends Component{
	static type = {
		CHATS:"chats",
		USERS:"users"
	}
	constructor(props){
		super(props)
		this.state={
			reciever:"",
			ActiveSideBar: SideBar.type.CHATS
		}
	}
		
	handleSubmit = (e) =>{
		e.preventDefault()
		const {reciever} = this.state
		const {onSendOpenPrivateMessage}=this.props
		onSendOpenPrivateMessage (reciever)
		this.setState({reciever:""})
	}
	addChatForUser = (username) =>{
		this.setActiveSideBar(SideBar.type.CHATS)
		this.props.onSendOpenPrivateMessage(username)
	}
	setActiveSideBar= (newSideBar) =>{
		this.setState({ActiveSideBar: newSideBar})
	}

	render(){
		const { chats, activeChat, user, setActiveChat, logout, users} = this.props
		const {reciever, ActiveSideBar} = this.state
		return (
			<div id="side-bar">
					<div className="heading">
						<div className="app-name">Cool Chat Name <FAChevronDown /></div>
						<div className="menu">
							<FAMenu />
						</div>
					</div>
					<form onSubmit={this.handleSubmit} className="search">
						<i className="search-icon"><FASearch /></i>
						<input 
							placeholder="Search"
							type="text"
							value={reciever}
							onChange={(e)=>{this.setState({reciever:e.target.value})}} />
						<div className="plus"></div>
					</form>

					<div className="side-bar-Select">
						<div 
							onClick = { () =>{this.setActiveSideBar(SideBar.type.CHATS)}}
							className={`side-bar-Select__option ${(ActiveSideBar===SideBar.type.CHATS) ? 'active':''}`}>
								<span>Chats</span>
						</div>
						<div 
							onClick = { () =>{this.setActiveSideBar(SideBar.type.USERS)}}
							className={`side-bar-Select__option ${(ActiveSideBar===SideBar.type.USERS) ? 'active':''}`}>
								<span>Users</span>
						</div>
					</div>
			
					<div 
						className="users" 
						ref='users' 
						onClick={(e)=>{ (e.target === this.refs.user) && setActiveChat(null) }} >				
						{
							ActiveSideBar===SideBar.type.CHATS ? 
								chats.map((chat)=>{
										return(
											<SideBarOption
											key = {chat.id}
											name = { chat.Community ? chat.name: createChatName(chat.users, user.name)}
											lastMessage = {get(last(chat.messages),'message','')}
											active = {activeChat.id === chat.id}
											onClick = { () => { this.props.setActiveChat(chat)}}
											/>
									)
									})
								:						
									differenceBy(users, [user], 'name').map((user)=>{
										return <SideBarOption
											key = {user.id}
											name = { user.name}			
											onClick = { () => {this.addChatForUser(user.name)}}
											/>	
									})
						}							
					</div>
					<div className="current-user">
						<span>{user.name}</span>
						<div onClick={()=>{logout()}} title="Logout" className="logout">
							<MdEject/>	
						</div>
					</div>
			</div>
		)
	}
}
