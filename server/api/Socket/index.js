let io = null;


// Message Receive functionality.
export function socketOpen(server) {
    io = require('socket.io')(server);

    io.sockets.on('connection', (socket) => {

        socket.on('test', (data) => {
            //todo create one callback function
            console.log("test", data);
            // socket.broadcast.emit("new test", {
            //     message: data
            // });

        });


    });
}


// Publish Message To socket.
export async function socketPublishMessage(publishChannelName, publishData) {
    try {
        io.sockets.emit(publishChannelName, publishData);
        return "success";
    }
    catch (error) {
        return error.message.toString();
    }
}


