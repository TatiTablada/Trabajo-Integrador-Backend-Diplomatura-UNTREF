const express = require('express')
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/database.js')
const app = express()
const port = process.env.PORT ?? 3000
const morgan = require('morgan')
const Prenda = require('./schema/product.js');



app.use(express.json())
app.use(morgan('dev'))
app.get('/', (req, res) => {
  res.json('Bienvenidos a la API de prendas')
})

app.use('/prendas', connectToMongoDB);
app.use('/prendas', async (req, res, next) => {
  res.on('finish', async () => {
    await disconnectFromMongoDB(req, res, next);
  });
  next();
});


// Se muestran todas las prendas y se filtran por nombre
app.get('/prendas', async (req, res) => {
  try {
    const { nombre } = req.query;
    const filterName = !nombre ? {} : { nombre: { $regex: `.*${nombre}.*`, $options: 'i' } };
    const prendas = await Prenda.find(filterName).sort({ codigo: 1 });
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
    const prenda = await Prenda.findById(id);
    if (prenda) {
      return res.json(prenda);
    }
    res.status(404).json({ message: 'Prenda no encontrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la prenda' });
  }
});

// Se crea una nueva prenda
app.post('/prendas', async (req, res) => {
  try {
    const { codigo, nombre, precio, categoria } = req.body;
    if (!codigo || !nombre || !precio || !categoria) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const nuevaPrenda = new Prenda({
      codigo,
      nombre,
      precio,
      categoria,
    });

    const prendaGuardada = await nuevaPrenda.save();
    res.status(201).json(prendaGuardada);
  } catch (error) {
    console.error('Error al crear la prenda:', error);
    res.status(500).json({ message: 'Error al crear la prenda', error: error.message });
  }
});

// Se modifica el precio de la prenda

app.patch('/prendas/:id', async (req, res) => {
  try {
    const { precio } = req.body;
    if (!precio) {
      return res.status(400).json({ message: 'El precio es requerido' })
    }

    const prendaActualizada = await Prenda.findByIdAndUpdate(req.params.id, { precio }, { new: true });
    if (!prendaActualizada) {
      return res.status(404).json({ message: 'Prenda no encontrada' });
    }
    res.json(prendaActualizada);
  } catch (error) {
    console.error('Error al actualizar el precio de la prenda', error);
    res.status(500).json({ message: 'Error al actualizar el precio de la prenda' });
  }
});

// Se elimina una prenda por id

app.delete('/prendas/:id', async (req, res) => {
  try {
    const prendaEliminada = await Prenda.findByIdAndDelete(req.params.id);
    if (!prendaEliminada) {
      return res.status(404).json({ message: 'Prenda no encontrada' });
    }
    res.json({ message: 'Prenda eliminada correctamente', prenda: prendaEliminada });
  } catch (error) {
    console.error('Error al eliminar la prenda', error);
    res.status(500).json({ message: 'Error al eliminar la prenda' });
  }
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});


app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})


