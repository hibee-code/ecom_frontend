<template>
  <q-page>
  <div class="q-px-lg flex flex-center">
    <div class="flex row">
      <q-card class="bg-secondary" :style="{ margin: '2rem 8rem', height: '8rem'}" style="width: 19rem; height: 16rem;" products :key="product.id">
        <h2 style="text-align: center;">{{ product.name }}</h2>
        <p style="text-align: center; margin-bottom: 7px;">{{ product.description }}</p>
        <button style="text-align: cen;" onclick="showProductDetails(product.id)">View Details</button>
      </q-card>
    </div>
  </div>
  </q-page>
</template>

<script setup lang="ts">
import { requestApi } from 'src/lib/requests/default.request';
import { onMounted, ref } from 'vue';

const product = ref<{
  id: string;
  name: string;
  description: string;
  price: string;
  stockQuantity: number;
  brand: string,
  imageUrl: string;
}[]>([

])


onMounted(async () => {
  product.value = await requestApi('http://localhost:5200/products/product/3', 'get')
})
</script>
