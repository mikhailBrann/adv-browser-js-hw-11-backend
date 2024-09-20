import Server from "./Server.js";
import { faker, th } from '@faker-js/faker'
const port = process.env.PORT || 8787;

export default class Mail {
    constructor() {
        this.server = new Server();

        //rout init
        this.server.setGetRouter('/messages/unread', this.getMail.bind(this));

        //init port
        this.server.app.listen(port, async () => {
            console.log(`Server started on port ${port}`);
        });
    }

    async getMail(req, res) {
        try {
            //симуляция ошибки сервера, успешен один из 3х запросов в среднем 
            if((Math.floor(Math.random() * 3) + 1) != 1) {
                throw new Error("Mail server error");
            }

            const mail = [];

            for (let i = 0; i < (Math.floor(Math.random() * 5) + 1); i++) {
                mail.push(this._generateFakeMail());
            }

            return res.status(200).send({"status": "ok", "messages": mail});
        } catch (error) {
            return res.status(500).send({'status': 'error', 'message': error.message});
        }
    }

    _generateFakeMail() {
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

        return {
            "id": faker.string.uuid(),
            "from": faker.internet.email(),
            "subject": faker.lorem.words({ min: 3, max: 6 }),
            "body": faker.lorem.words({ min: 8, max: 20 }),
            "received": faker.date.between({ from: twoHoursAgo, to: now })
        };
    }
}