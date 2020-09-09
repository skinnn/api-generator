<template>
<div class="helper-tooltip">
	<div @click="handleClick" class="helper-question-mark" :title="title">?</div>

	<div @click="handleClick" class="help-box">
		<transition :name="transition">
			<div v-if="showHelp" :class="['help-popover', {'popover-no-heading': !heading}]">
				<div :class="['arrow', {'no-heading': !heading}]" />
				<header v-if="heading" class="popover-header">
					{{ heading }}
				</header>
				<main class="popover-body">
					<slot></slot>
				</main>
			</div>
		</transition>
	</div>
</div>
</template>

<script>
export default {
	name: 'BaseHelper',
	props: {
		heading: {
			type: [String, Number],
			default: null
		},
		text: {
			type: [String, Number],
			default: null
		},
		title: {
			type: String,
			default: ''
		},
		transition: {
			type: String,
			default: 'slide-fade'
		}
	},

	data() {
		return {
			showHelp: false
		};
	},

	methods: {
		handleClick() {
			this.showHelp = !this.showHelp;
		}
	}
};
</script>

<style lang="scss">
.helper-tooltip {
	display: inline-block;
}

.helper-question-mark {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 18px;
	height: 18px;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	user-select: none;
	font-size: 14px;
	background-color: lightgray;
	color: #fff;
	font-weight: 600;
	&:hover {
		cursor: pointer;
		background-color: darken(lightgray, 10%);
	}
}

.help-box {
	// display: block;
	position: relative;

	.help-popover {
		// display: block;
		position: absolute;
		top: -37px;
		left: 30px;
		min-height: 50px;
		width: fit-content;
		border: 1px solid rgba(0, 0, 0, 0.25);
		border-radius: 5px;
		z-index: 1000;
		background-color: #fff;
		cursor: pointer;

		&.popover-no-heading {
			top: -33px;
		}

		header.popover-header {
			width: 100%;
			padding: 0.4rem 0.7rem;
			user-select: none;
			font-size: 14px;
		}

		main.popover-body {
			// display: block;
			padding: 0.4rem 0.7rem;
			font-size: 14px;
			user-select: none;
			min-width: 300px;
			max-width: 340px;
		}

		div.arrow {
			position: absolute;
			display: block;
			left: calc((0.5rem + 1px) * -1);
			top: 34px;
			width: 0.5rem;
			height: 1rem;
			margin: 0.3rem 0;
			&::before {
				position: absolute;
				left: 0;
				display: block;
				content: "";
				border-color: transparent;
				border-style: solid;
				border-right-color: #fff;
				border-width: 0.5rem 0.5rem 0.5rem 0;
				border-right-color: rgba(0, 0, 0, 0.25);
			}
			&::after {
				position: absolute;
				left: 1px;
				display: block;
				content: "";
				border-color: transparent;
				border-style: solid;
				border-right-color: #fff;
				border-width: 0.5rem 0.5rem 0.5rem 0;
			}
			&.no-heading {
				top: 11px;
			}
		}
	}
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
	transition: all .3s ease;
}
.slide-fade-leave-active {
	transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
	transform: translateX(10px);
	opacity: 0;
}
</style>