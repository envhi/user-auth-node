import { Op } from "sequelize";
import User from "../models/User";
import File from "../models/File";
import * as Yup from "yup";
import { parseISO } from "date-fns";

class UsersController {
  async index(req, res) {
    const data = await User.findAll({
      include: [
        {
          model: File,
          attributes: ["id", "name"],
        },
      ],
    });

    return res.json(data);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "error on schema" });
    }

    try {
      const { id, name, email, createdAt, updatedAt } = await User.create(
        req.body
      );
      return res.status(201).json({ id, name, email, createdAt, updatedAt });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field,
        ),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field,
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "caiu no yup" });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    const { oldPassword } = req.body;

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "User password not match." });
    }

    const { id, name, email, createdAt, updatedAt } = await user.update(
      req.body,
    );

    return res.status(201).json({ id, name, email, createdAt, updatedAt });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      res.status(404).json();
    }

    await user.destroy();

    return res.json();
  }

}

export default new UsersController();
