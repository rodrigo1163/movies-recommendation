import { qdrant } from "@/lib/qrdrant";


async function initQdrant() {
	const collections = await qdrant.getCollections();

	const exists = collections.collections.some(
		c => c.name === "products"
	);

	if (!exists) {
		await qdrant.createCollection("products", {
			vectors: {
				size: 1536,
				distance: "Cosine",
			},
		});
	}
}

// await initQdrant();