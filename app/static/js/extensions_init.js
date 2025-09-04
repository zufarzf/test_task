// #####   #####   SocketIO   #####   #####

// function  init_socket_io(mode) {
	// let modes = {
	// 	localhost: '127.0.0.1:8000',
	// 	domain: 'https://salusmed.uz/',
	// 	ip: 'http://134.209.102.6:8000/',
	// }
	// return io.connect(modes[mode])
// };
// const socket = init_socket_io('/')

const socket = io.connect('/')

// #####   #####   SocketIO   #####   #####