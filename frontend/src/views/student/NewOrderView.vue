<template>
    <div class="student-page">
        <h1>New Print Order</h1>
        <p>Upload your document and customize your printing options. </p>

        <section class="order-section" >
            <h2>1.Upload Documents</h2>
            <input type="file" accept=".pdf,.docx,.jpg,.jpeg,.png" @change='handleFile' />

            <div v-if="file" class="file-info">
                <i class="fa-solid fa-file"></i>
                <div>
                    <strong>{{file.name}}</strong>
                    <small>{{ formatFileSize(file.size) }}</small>
                </div>
            </div>

        </section>

        <section class="order-section">
            <h2>2.printing Options</h2>

            <div class="option-group">
                <label>Print Type</label>
                <div class="options">

                    <button type="button" :class="{active:printType=='bw'}" @click="printType ='bw'" >
                        <i class="fa-solid fa-file-lines"></i>
                        Black & White
                    </button>

                    <button type="button" :class="{active:printType=='color'}" @click="printType ='color'" >
                        <i class="fa-solid fa-palette"></i>
                        Color
                    </button>

                </div>
            </div>

            <div class="option-group">
                <label >Pages</label>
                <input v-model.number="pages" type="number" min="1" step="1" />
            </div>

            <div class="option-group">
                <label >Copies</label>
                <input v-model.number="copies" type="number" min="1" step="1" />
            </div>

            <div class="option-group">
                <label>Print Sides</label>

                <div class="options">
                    <button type="button" :class="{ active: sides === 'single' }" @click="sides = 'single'">
                        Single-sided
                    </button>

                    <button type="button" :class="{ active: sides === 'double' }" @click="sides = 'double'">
                        Double-sided
                    </button>
                </div>
            </div>

            <div class="option-group">
                <label class="checkbox-option">
                    <input v-model="lamination" type="checkbox"/>
                    Add Lamination
                </label>
            </div>

        </section>

        <section class="order-summary">
            <h2>Order Summary</h2>

            <div class="summary-row">
                <span>Printing</span>
                <span>₹{{ printingCost.toFixed(2) }}</span>
            </div>

            <div class="summary-row">
                <span>Lamination</span>
                <span>₹{{ laminationCost.toFixed(2) }}</span>
            </div>

            <div class="summary-row total">
                <strong>Total</strong>
                <strong>₹{{ totalCost.toFixed(2) }}</strong>
            </div>

            <button class="place-order-btn" :disabled="!is_order_valid" @click="place_order">
                <i class="fa-solid fa-cart-plus"></i>
                Place Order
            </button>

        </section>

    </div>

</template>

<script setup >

    import {ref,computed} from 'vue';
    import { create_order_service } from '../../services/orderService.js';

    const file=ref(null);

    const printType=ref('bw');
    const pages=ref(1);
    const copies=ref(1);
    const sides=ref('single');
    const lamination=ref(false);

    //temp
    const bwPrice=2;
    const colorPrice=5;
    const lamination_price=10;


    //validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    const ALLOWED_FILE_TYPES = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'];

    const handleFile=(event)=>{
        const selected_file=event.target.files[0];
        if (!selected_file){
            return;
        }

        if(!ALLOWED_FILE_TYPES.includes(selected_file.type)){
            alert(`Invalid file type.Please upload PDF,DOCX,JPG or PNG.`);
            event.target.value='';
            return;

        }

        if(selected_file.size > MAX_FILE_SIZE){
            alert(`File size must be less than 10 MB.`);
            event.target.value='';
            return;
        }

        file.value=selected_file;
    }

    const is_order_valid=computed(()=>{
        return(
        file.value !== null &&
        pages.value >= 1 &&
        copies.value >= 1 &&
        Number.isInteger(pages.value) &&
        Number.isInteger(copies.value)
        )
    })

    const formatFileSize=(size)=>{
        if (size<1024){
            return `${size}B`;
        }

        if (size<1024 * 1024){
            return `${(size/1024).toFixed(1)}KB`;
        }
        return `${(size/(1024*1024)).toFixed(1)}MB`
    }

    const printingCost=computed(()=>{
        const price=printType.value==='bw' ? bwPrice : colorPrice;
        let cost=pages.value * copies.value * price;
        if (sides.value==='double'){
            cost*=0.9;
        }
        return cost;
    })

    const laminationCost=computed(()=>{
        return lamination.value ? pages.value * copies.value * lamination_price : 0;
    })

    const totalCost=computed(()=>{
        return printingCost.value + laminationCost.value;
    })

    const placeOrder=()=>{
        if(!file.value){
            alert('Please upload a document.')
            return ;
        }
        if(!pages.value || pages.value<1){
            alert('Pages must be least 1.');
            return;
        }
        if (!copies.value || copies.value < 1){
            alert('Copies must be at least 1.');
            return;
        }
        if(!Number.isInteger(copies.value)){
            alert('Copies must be a whole number.');
            return;

        }

        const order_date={
            file:file.value,
            printType:printType.value,
            pages:pages.value,
            copies:copies.value,
            sides:sides.value,
            lamination:lamination.value,
            total:totalCost.value
        }

        console.log("Orders",order_date)
        alert('Order details prepared successfully');
    }

    const place_order=async ()=>{
        if(!is_order_valid){
            alert('Please complete all required fields.')
            return ;
        }
        const format_data=new FormData();

        format_data.append('document',file.value);
        format_data.append('printType',printType.value),
        format_data.append('pages',pages.value);
        format_data.append('copies',copies.value);
        format_data.append('sides',sides.value);
        format_data.append('lamination',lamination.value);

        try{
            const response=await create_order_service(format_data);
            alert(`Order created successfully! \n Order Number: ${response.data.order_number}`);
        }catch(err){
            console.log('Order creation failed:',err);
            const message=err.response?.data?.message || 'Failed to create order. Please try again,';
            alert(message);
        }
    }

</script>

<style scoped >
    @import '../../styles/new-order.css';
</style>