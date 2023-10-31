import File from "../models/File"

class FilesController {

  async read(req, res){
    const data = await File.findAll();
    res.json(data)
  }

  async create(req, res){

    const { originalname: name, filename: path} = req.file;
    try {
      const file = await File.create({
        user_id: req.params.userId,
        name,
        path,
      });

      return res.status(201).json(file);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  }
}

export default new FilesController();
