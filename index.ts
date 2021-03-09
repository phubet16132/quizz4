import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { body, query, validationResult } from 'express-validator'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000
const SECRET = "SIMPLE_SECRET"

interface JWTPayload {
  username: string;
  password: string;
}

app.post('/login',
  body('username').isString(),
  body('password').isString(),
  (req, res) => {

    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid username or password" })

    const { username, password } = req.body
    // Use username and password to create token.
    const buffer = fs.readFileSync("./db.json", { encoding: "utf-8" });
    const data = JSON.parse(buffer);

    const isCompleted = data.users.find((value: 
      { username: any; password: string }) => value.username === username 
        && value.password === password
    );

    if (isCompleted) {
      const token = jwt.sign({ username: isCompleted.username },SECRET);
      return res.status(200).json({
        message: 'Login succesfully',
        token,
      })
    }

      res.status(400)
      res.json({massage:'Invalid username or password'})
      return
  })

app.post('/register',
  body('username').isString(),
  body('password').isString(),
  body('firstname').isString(),
  body('lastname').isString(),
  body('balance').isInt(),
  (req, res) => {

    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid data" })

    const { username, password, firstname, lastname, balance } = req.body
    const newUser = { username, password, firstname, lastname, balance };

    const buffer = fs.readFileSync("./db.json", { encoding: "utf-8" });
    const data = JSON.parse(buffer);

    const haveUser = data.users.find((value: { username: any }) => value.username === username);

    if(haveUser){

      res.status(200)
      res.json({massage:'Username is already in used'})
      return
    }

    data.users.push(newUser);
    fs.writeFileSync("./db.json", JSON.stringify(data));

      res.status(400)
      res.json({massage:'Register successfully'})
      return

  })
app.get('/balance',
  (req, res) => {
    const token = req.query.token as string
    try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
  
    }
    catch (e) {
      //response in case of invalid token
    }
  })

app.post('/deposit',
  body('amount').isInt({ min: 1 }),
  (req, res) => {

    //Is amount <= 0 ?
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid data" })
  })

app.post('/withdraw',
  (req, res) => {
  })

app.delete('/reset', (req, res) => {

  //code your database reset here
  
  return res.status(200).json({
    message: 'Reset database successfully'
  })
})

app.get('/me', (req, res) => {
  
})

app.get('/demo', (req, res) => {
  return res.status(200).json({
    message: 'This message is returned from demo route.'
  })
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))