import { Router } from 'express'
import { qdrant } from './lib/qrdrant';
import OpenAI from "openai";
import { randomUUID } from 'node:crypto'
import { env } from './env';

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

const router = Router()

router.get('/', (req, res) => {
	res.send('Hello World')
})

async function generateEmbedding(text: string) {
	const response = await openai.embeddings.create({
		model: 'text-embedding-3-small',
		input: text,
	});

	return response.data[0].embedding;
}

function buildProductText(product: { name?: string; category?: string; brand?: string; description?: string }) {
	return [
		`Nome: ${product.name ?? ""}`,
		`Categoria: ${product.category ?? ""}`,
		`Marca: ${product.brand ?? ""}`,
		`Descrição: ${product.description ?? ""}`,
	].join("\n");
}

router.post("/products", async (req, res) => {
	const { name, category, brand, description } = req.body;

	if (!name) {
		return res.status(400).json({
			error: "Campos obrigatórios: name",
		});
	}
	const id = randomUUID();

	const product = { id, name, category, brand, description };

	const text = buildProductText(product);
	const vector = await generateEmbedding(text);

	await qdrant.upsert('products', {
		wait: true,
		points: [
			{
				id,
				vector,
				payload: product,
			},
		],
	});

	return res.status(201).json({
		message: "Produto salvo com embedding",
	});

});

router.post("/products/bulk", async (req, res) => {
	try {
		const products = req.body;

		if (!Array.isArray(products)) {
			return res.status(400).json({
				error: "Body deve ser um array",
			});
		}

		// monta textos
		const texts = products.map((product) => `
      Nome: ${product.name ?? ""}
      Categoria: ${product.category ?? ""}
      Marca: ${product.brand ?? ""}
      Descrição: ${product.description ?? ""}
    `);

		// gera embeddings em batch
		const response = await openai.embeddings.create({
			model: "text-embedding-3-small",
			input: texts,
		});

		const points = products.map((product, index) => {
			const id = randomUUID();

			return {
				id,
				vector: response.data[index].embedding,
				payload: {
					id,
					...product,
				},
			};
		});

		await qdrant.upsert("products", {
			wait: true,
			points,
		});

		return res.status(201).json({
			message: "Produtos inseridos com sucesso",
			count: points.length,
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			error: "Erro ao inserir produtos",
		});
	}
});

router.get("/recommend", async (req, res) => {
	const query = String(req.query.query ?? "").trim();

	if (!query) {
		return res.status(400).json({
			error: "Informe ?query=...",
		});
	}
	const queryVector = await generateEmbedding(query);

	const result = await qdrant.query('products', {
		query: queryVector,
		limit: 5,
		with_payload: true,
	});

	return res.json(result.points);
});

export { router }