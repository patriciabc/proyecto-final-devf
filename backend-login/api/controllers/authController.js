import bcrypt from 'bcrypt'
import User from '../models/User.js';
import jwt from 'jwt-simple'
import configDB from '../config/index.js';
import nodemailer from 'nodemailer'

const sendEmailVerificateUser = async (req, res) =>{
  
  const user = await User.findOne({
      email: req.body.email,
  });
  
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 5);

  const payload = {
    userId: user.id,
    expirationDate,
  };
  
  const token = jwt.encode(payload, configDB.jwt.secret);

  const link = configDB.linkVerificateUser+token
  
   const transporter = nodemailer.createTransport({
      host:configDB.email.host,
      port: configDB.email.port,
      secure: false, 
      auth: {
          user: configDB.email.auth.user,
          pass: configDB.email.auth.pass,
      },
  });
  
  const info = await transporter.sendMail({
    from: configDB.email.from, // De
    to: user.email, //Para
    subject: configDB.email.subject, //Asunto    
    html: `<html><head><title>Verificación de Cuenta</title></head>
    <body style="background-color:#373751;font-family:Segoe UI">
      <div style="padding:50px">
        <div style="padding-left:20px;padding-right:20px;padding-bottom:1px;padding-top:1px; background-color:#5136ad;color:#fff">
          <h1 style="margin-left:0; margin-right:0; text-align:center">VERIFICACIÓN DE CUENTA</h1>
        </div>
        <div style="padding:20px; background-color:#cebfff">
          <p style="margin-left:0; margin-right:0"><b>Hola ${user.name}</b>,</p>
          <p style="margin-left:0; margin-right:0">Gracias por crear una cuenta en <b>Developers Devf</b>. Para completar el proceso de registro 
          tienes que verificar tu cuenta haciendo clic en este enlace: 
          <a href="${link}" style="font-weight:normal;text-decoration:underline;color:#f96a01" target="_blank">${link}</a></p>      
          <p style="margin-left:0; margin-right:0">Esperamos verte pronto.</p>
        </div>
      </div>
    </body>
    </html>`,//Mensaje
  });

}


const verificate = async(req, res) => {
  try {
    
      const { token } = req.params;
      const decoded  = jwt.decode(token,configDB.jwt.secret);
      const ahora = new Date();
      const validate = new Date(decoded.expirationDate);
      
      if(ahora.getTime() > validate.getTime()){
        return res.send(`<html><head><title>Verificación de Cuenta</title></head>
          <body style="background-color:#373751;font-family:Segoe UI">
          <div style="padding-left:20px;padding-right:20px;padding-bottom:1px;padding-top:1px;width:500px;margin-top:100px; margin-left:35%; background-color:#5136ad;color:#fff">
            <h1 style="margin-left:0; margin-right:0; text-align:center">TIEMPO DE VERIFICACIÓN EXPIRADO</h1>
          </div>
          <div style="padding:20px;width:500px; margin-left:35%; background-color:#cebfff">
            <p style="margin-left:0; margin-right:0;text-align:center">Vuelva a solicitar la verificación de la cuenta.</p>      
            <p style="margin-left:0; margin-right:0;text-align:center">Hasta pronto.</p>
          </div>
          </body>
          </html>`);
      }
      
      const updateUser = await User.findByIdAndUpdate(decoded.userId, { isVerificate: true });

      return res.send(`<html><head><title>Verificación de Cuenta</title></head>
      <body style="background-color:#373751;font-family:Segoe UI">
      <div style="padding-left:20px;padding-right:20px;padding-bottom:1px;padding-top:1px;width:300px;margin-top:100px; margin-left:35%; background-color:#5136ad;color:#fff">
        <h1 style="margin-left:0; margin-right:0; text-align:center">¡FELICITACIONES!</h1>
      </div>
      <div style="padding:20px;width:300px; margin-left:35%; background-color:#cebfff">
        <p style="margin-left:0; margin-right:0;text-align:center">Gracias por verificar tu cuenta.</p>      
        <p style="margin-left:0; margin-right:0;text-align:center">Esperamos verte pronto.</p>
      </div>
      </body>
      </html>`); 
          
  } catch (error) {
      return res.status(500).send(`<br/><br/><b><h1 style="color:red;text-align:center">Ocurrio un error al verificar la cuenta</h1></b>`)
  }
}

const register = async(req, res) => {
    try {
        // Encriptamos el password enviado desde el body
        const encryptedPass = await bcrypt.hash(req.body.password, 4);
        req.body.password = encryptedPass;
        const user = await User.create(req.body);

        if(user){
          sendEmailVerificateUser(req, res)
        }
        //Ocultamos la encriptacion
        user.password = undefined;
        return res.json({
            msg: 'Usuario creado',
            data: { user }
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrio un error al registrar usuario',
            error
        })
    }
}

const login = async (req, res) => {
    try {
        // Buscamos un usuario con el correo en el body
        const user = await User.findOne({
            email: req.body.email,
        });
        // Si no lo encuentra
        if (!user) {
            return res.status(404).json({
            msg: 'Usuario no encontrado',
        });
        }             
        // Si encuentra el usuario verificamos la contraseña
        const passCorrect = await bcrypt.compare(req.body.password, user.password);
        // Si esta mal la contraseña    
        if (!passCorrect) {
            return res.status(401).json({
            msg: 'Credenciales inválidas',
            });
        }

        if (user.isActive == false) {
          return res.status(404).json({
            msg: 'Usuario no esta habilitado',
          });       
        } 

        if (user.isVerificate == false) {
          return res.status(404).json({
            msg: 'Usuario no verificado',
          }); 
        }          
        // Si todo va bien, crear token con tiempo
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 2);
        const payload = {
            userId: user.id,
            expirationDate,
            role: user.role,
        };
        // Falta en el index de config la llave
        const token = jwt.encode(payload, configDB.jwt.secret);
      return res.json({
        msg: 'Login correcto',
        data: { token },
      });
    } catch (error) {
      return res.status(500).json({
        msg: 'Error al hacer login',
      });
    }
  };


export {register, login, verificate}