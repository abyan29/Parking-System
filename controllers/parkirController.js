import Parkir from "../model/parkir.js";
import User from "../model/user.js";

export default class ParkirController {
    static async order(req,res) {
        const { duration, nopol } = req.body;
        const user_id = req.userId;
        const total = duration * 3000;
        const parkir = await Parkir.create({ duration, total, nopol, user_id });
        return res.json(parkir);
    }

    static async get(req,res) {
        const user_id = req.userId;
        console.log(user_id);
        
        const parkir = await Parkir.findAll({
            where: { user_id },
            include: [User],
        });

        return res.json(parkir);
    }

    static async update(req,res) {
        const user_id = req.userId;
        const { duration, nopol } = req.body;
        const parkir_id = req.params.id;

        const total = duration * 3000;
        
        const parkir = await Parkir.update(
            { duration, total, nopol, user_id },{
                where: { 
                id: parkir_id 
            }}
        );

        return res.json(parkir);
    }

    static async cancel(req,res) {
        const parkir_id = req.params.id;
        const parkir = await Parkir.destroy({
            where: {
                id: parkir_id
            }
        });
        return res.json(parkir);
    }
}