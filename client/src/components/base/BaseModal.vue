<template>
	<transition name="fade" mode="out-in">
		<div
			v-show="show"
			ref="modalContainer"
			:class="['modal-container', {'modal-show': show}]"
		>
			<div class="modal">
				<slot></slot>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'BaseModal',
	props: {
		show: {
			type: Boolean,
			default: false
		}
	}
};
</script>

<style lang="scss">

.modal-container{
	visibility: hidden;
	opacity: 0;
	display: block;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	padding: 2% 0;
	overflow-y: auto;
	max-height: 100%;
	background-color: rgb(0, 0, 0);
	background-color: rgba(0, 0, 0, 0.45);
	transition: visibility 0s, opacity 0.3s ease-in-out;
	scroll-behavior: smooth;
	z-index: 100;
	.modal {
		width: 55%;
		height: fit-content;
    margin: 0 auto;
    padding: 3% 4%;
		background-color: rgb(255,255,255);
		position: relative;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: .3rem;
    outline: 0;
	}
}

.modal-show {
	visibility: visible !important;
	opacity: 1 !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 300ms;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>