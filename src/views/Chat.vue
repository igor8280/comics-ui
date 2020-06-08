<template>
	<layout-main>
		<template v-slot:title>
			<label>I am {{user.nickname}}</label>
		</template>
		<div class="content">
			<div class="columns">
				<div class="column">
					<label>Chat rooms</label>
					<ul v-for="room in rooms" v-bind:key="room._id">
						<li v-on:click="joinRoom(room.name)">{{room.name}}</li>
					</ul>
				</div>
				<div class="column">
					<label>Joined users</label>
					<ul v-for="(conn, index) in connections" v-bind:key="index">
						<li v-if="socketId !== conn.socketId">{{conn.user.nickname}} / {{conn.socketId}}</li>
					</ul>
				</div>
			</div>
			<div class="columns">
				<div class="column is-half">
					<b-field label="Message">
						<b-input v-model="msgVal" />
					</b-field>
				</div>
				<div class="column is-one-quarter">
					<b-field label="Submit">
						<b-button type="is-info" @click="sendMsg">Message</b-button>
					</b-field>
				</div>
			</div>
			<div class="columns">
				<div class="column is-one-quarter">
					<label>Room messages</label>
					<ul v-for="data in messages" v-bind:key="data.socketId">
						<li>{{data.msg}} / by user / {{data.user}}</li>
					</ul>
				</div>
				<div class="column">
					<label>User messages</label>
				</div>
			</div>
		</div>
	</layout-main>
</template>

<script>
import socket from 'socket.io-client';
export default {
	name: 'chat',
	data() {
		return {
			msgVal: null,
			messages: [],
			rooms: [],
			connections: null,
			io: null,
			socketId: null,
			user: JSON.parse(this.$store.getters.user).user
		};
	},
	mounted() {
		this.getRooms();
	},
	methods: {
		async getRooms() {
			try {
				let data = await this.$api.rooms.get();
				if (data)
					this.rooms = data.body.content;
			}
			catch (error) {
				this.$utils.handleResponseError(error);
			}
		},
		joinRoom(name) {
			// create connection
			this.io = socket('http://localhost:9999', {
				query: {
					token: 'code'
				}
			});

			// join room
			this.io.emit('joinRoom', {room: name, user: this.user});

			this.io.on('connect', () => {
				console.log('+++++++++', this.io.id);
				this.socketId = this.io.id;
			});

			this.io.on('userEntered', data => {
				console.log('ON userEntered', data.users);
				this.connections = data.users;
				// this.connections.push({user: data.user, socketId: this.socketId});
			});

			this.io.on('chatMessage', data => {
				this.messages.push(data);
			});
		},
		sendMsg() {
			this.io.emit('chatMessage', {msg: this.msgVal, socketId: this.socketId, user: this.user.nickname}, data => {
				console.log('acknowledgement', data);
			});
			this.msgVal = null;
		}
	}
};
</script>
