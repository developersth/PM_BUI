const db = require('../models');
//const fn = require('../plugins/function');
import fn from "../plugins/function";
module.exports = {
  index: async (req, res) => {
    try {
      const docs = await db.Documents.findAll({order: [['id', 'DESC']]})
      return res.json(docs)
    } catch (e) {
      return res.status(500).json({ message: 'Cannot get data from database.' })
    }
  },
  store: async (req, res) => {
    const data = req.body
    let id = 1
    console.log(data)
    if (data) {
      try {
        const docs = await db.sequelize.transaction((t) => {
          return db.Documents.create(data, { transaction: t }).then(result => id = result.id)
        })
        data.DocNo = fn.formatDocNo(id)  //รูปแบบรหัสเอกสาร
        await db.Documents.update({ DocNo: data.DocNo }, { where: { id: id } }) //update DocNo.
        return res.status(201).json({ success: true, message: 'Documents Created Successfully', docs })
      } catch (e) {
        return res.json({ success: false, message: 'Cannot store data to database.' })
      }
    }
    return res.status(400).json({ success: false, message: 'Bad request.' })
  },
  update: async (req, res) => {
    const id = req.params.id
    const data = req.body
    if (id && data) {
      const result = await db.Documents.update(data, { where: { id: id } })
      console.log(result)
      return res.json({ success: true, message: 'Documents Update Successfully ', result })
    }
    return res.status(400).json({ success: false, message: 'Bad request.' })
  },
  destroy: async (req, res) => {
    const id = req.params.id
    if (id) {
      try {
        await db.Documents.destroy({ where: { id } })
        return res.send({ success: true, message: 'Delete Documents Successfully' });
      } catch (e) {
        return res.json({ success: false, message: 'Cannot remove data from database.' })
      }
    } else {
      return res.status(400).json({ success: false, message: 'Bad request.' })
    }
  }
}