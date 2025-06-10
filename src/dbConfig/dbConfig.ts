import mongoose from 'mongoose'


export async function connect() {
    try {
        mongoose.connect("mongodb+srv://youtube:youtube@cluster0.3oyk3yl.mongodb.net/")
        const connection = mongoose.connection;


        connection.on('connected', () => {
            console.log('MongoDb connected successfully')
        })
        
        connection.on('error', (err) => {
            console.log('MongoDb connection error. Please make sure MongoDb is running.' + err)
            process.exit()
        })

    } catch (error) {
        console.log('Something goes wrong!'); 
        console.log(error)
    }
}