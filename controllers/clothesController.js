import fs from "fs/promises";
import process from "process";

process.chdir(import.meta.dirname);

export const getClothes = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 10;
    const data = await fs.readFile('../db/db.json', 'utf-8');
    const jsonData = JSON.parse(data);
    const start = page * perPage;
    const end = start + perPage;
    const result = jsonData.items.slice(start, end);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    return res.status(200).json({
        items: result,
        total: jsonData.items.length,
        page,
        perPage,
        totalPages: Math.ceil(jsonData.items.length / perPage),
    });
}

export const addCloth = async (req, res) => {
    const { image, name, price, rating } = req.body;
    const data = await fs.readFile('../db/db.json', 'utf-8');
    const jsonData = JSON.parse(data);

    const maxId = jsonData.items.reduce((max, item) => Math.max(max, item.id), 0);

    const newItem = {
        id: maxId + 1,
        image,
        name,
        price,
        rating,
    };

    jsonData.items.push(newItem);
    await fs.writeFile('../db/db.json', JSON.stringify(jsonData), 'utf-8');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    return res.status(201).json(newItem);
}

export const editCloth = async (req, res) => {
    const { id } = parseInt(req.params);
    const { image, name, price, rating } = req.body;
    const data = await fs.readFile("../db/db.json", "utf-8");

    const jsonData = JSON.parse(data);
    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).send("Not Found");
    }

    jsonData.items[index] = {
        id,
        image,
        name,
        price,
        rating,
    };
    await fs.writeFile("../db/db.json", JSON.stringify(jsonData), 'utf-8');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    return res.status(200).json(jsonData.items[index]);
}

export const deleteCloth = async (req, res) => {
    const { id } = parseInt(req.params);
    const data = await fs.readFile("../db/db.json", "utf-8");

    const jsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).send("Not Found");
    }

    jsonData.items.splice(index, 1);
    await fs.writeFile("../db/db.json", JSON.stringify(jsonData), "utf-8");

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    return res.status(204).json({ id });
}
