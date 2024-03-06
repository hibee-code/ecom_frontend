<template>
  <q-page>
    <div class="q-px-lg flex flex-center">
      <!-- products div -->
      <div class="flex row">
        <q-card class="bg-secondary" :style="{ margin: '2rem 8rem', height: '8rem'}" style="width: 16rem;" v-for="product of products" :key="product.id">
          <q-card-section>
            <div class="flex row justify-between">
              <q-chip class="bg-accent"> {{  product.name }}</q-chip>
              <q-chip style="background-color: #de43de">{{ product.price }}</q-chip>
            </div>
            <div class="flex row justify-center"> {{ product.description }}</div>
            <div class="flex row justify-end q-mt-md" style="width: 100%;"><q-btn size=".6rem" round icon="add" /></div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { requestApi } from 'src/lib/requests/default.request';
import { computed, onMounted, ref } from 'vue';
/*
  display products
  description
  price
  name
  image
  stock quantity
 */

// refs
const products = ref<{
  id: string;
  name: string;
  description: string;
  price: string;
  stockQuantity: number;
  brand: string,
  imageUrl: string;
}[]>([


])


// watchers


// life cycle hooks
onMounted(async () => {
  products.value = await requestApi('http://localhost:5200/products/view-all-product', 'get')
})

</script>

<!-- Authorization: `Bearer ${authUserData?.token}`, -->


