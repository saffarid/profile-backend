<template>
    <Card ref="FullCard"
          :options="{'--width':'88%',
                               '--height':'85%',
                               '--inner_color': 'var(--primary_color)',
                               '--outer_color': '#014a5f'}">
        <div class="card thoth">
            <div class="d">
                <div class="title">{{data.title}}</div>
                <div class="desc" v-html="data.desc"/>
            </div>
			<div class="images">
				<img @click="showImage($event)" class="image products"
					 :width="width"
					 :src="'/img/png/products.png'">
				<img @click="showImage($event)" class="image purchase"
					 :width="width"
					 :src="'/img/png/purchase.png'"/>
				<img @click="showImage($event)" class="image settings"
					 :width="width"
					 :src="'/img/png/settings.png'">
				<img @click="showImage($event)" class="image types_of_products"
					 :width="width"
					 :src="'/img/png/types%20of%20products.png'">
			</div>
        </div>

    </Card>
</template>

<script>

    import Card from '../../../components/Card'
    import {
        ref,
        watch,
    }           from 'vue'

    export default {
        name: 'thoth',
        components: {
            Card,
        },
        props: {
            data: {
                type: Object,
                required: false,
            },
        },
        setup() {
            let activeImage = null
            const width = ref(0)
            const FullCard = ref(null)

            watch(FullCard, () => {
                width.value = (300 / 1080) * window.innerWidth
                window.addEventListener('resize', () => {
                    width.value = (300 / 1080) * window.innerWidth
                })
            })

            const showImage = (e) => {
                console.log(e)
                if (activeImage != null) {
                    activeImage.target.classList.toggle('show_image')
                }
                if (activeImage != null && JSON.stringify(activeImage.target) == JSON.stringify(e.target)) {
                    activeImage = null
                    return
                }
                e.target.classList.toggle('show_image')
                activeImage = e
            }

            return {
                FullCard,
                width,
                showImage,
            }
        },
    }
</script>

<style lang="scss" scoped>

    @import "card";

    .thoth {
        display: grid;
        grid-template-columns: 1fr 3fr;

        height: 96%;

        padding: 1%;

        column-gap: 1%;

        .images {
            display: grid;

            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;

            column-gap: 10px;
            row-gap: 10px;

            align-self: center;
            align-content: center;
            align-items: center;

            .image {
                width: 100%;
            }

            .show_image {
                position: absolute;
                margin: auto;
				padding-right: 10px;
				width: -moz-available;
				width: -webkit-fill-available;
            }
        }

        .d {
            display: grid;
            grid-template-rows: max-content max-content max-content;
            row-gap: 5px;

            .link {
                border: 2px solid #4ae2fb;
                border-radius: 1000000px;
                text-decoration: none;
            }
        }
    }

</style>