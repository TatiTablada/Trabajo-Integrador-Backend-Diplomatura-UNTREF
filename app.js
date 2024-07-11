const express = require('express')
const {connectToMongoDB, disconnectFromMongoDB} = require('./src/database.js')
const app = express()
const port = process.env.PORT ?? 3000
const morgan = require('morgan')
const { ObjectId } = require('mongodb')
const Prenda = require('./schema/product.js');


app.use(express.json())
app.use(morgan('dev'))
app.get('/', (req, res) => {
  res.json('Bienvenidos a la API de prendas')
})

app.use('/prendas', connectToMongoDB, async (req,res,next) => {
    res.on('finish', async () => {
    await disconnectFromMongoDB(req,res,next)
    })
    next()
})


// Se muestran todas las prendas y se filtran por nombre
app.get('/prendas', async (req, res) => {
  try {
    const { nombre } = req.query;
    const filterName = nombre ? { nombre: { $regex: `.*${nombre}.*`, $options: 'i' } } : {};
    const prendas = await req.db.find(filterName).sort({ codigo: 1 }).toArray();
    res.json(prendas);
  } catch (error) {
    console.error('Error al obtener las prendas:', error);
    res.status(500).json({ error: 'Error al obtener las prendas' });
  }
});

// Se muestran prendas por _id
app.get('/prendas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const prenda = await req.db.findOne({ _id: objectId });
    if (prenda) {
      return res.json(prenda);
    }
    res.status(404).json({ message: 'Prenda no encontrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la prenda' });
  }
});

app.post('/prendas', async (req, res) => {
  const nuevaPrenda = new Prenda(req.body);
   try {
    await nuevaPrenda.save();
    res.status(201).json(nuevaPrenda);
   } catch (error) {
    console.error('Error al crear la prenda:', error);
    res.status(500).json({ error: 'Error al crear la prenda' });
  }
});



app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})


