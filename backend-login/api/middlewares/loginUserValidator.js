import joi from "joi"
const createUserSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
})
export default async(req, res, next) => {
    try {
        await createUserSchema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Error de validacion',
            error
         })
     }
 
 }