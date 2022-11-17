import joi from "joi"
let options = ['Administrator', 'Employee', 'Customer'];
const createUserSchema = joi.object({
  name: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  birthDate: joi.date(),
})
export default async (req, res, next) => {
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