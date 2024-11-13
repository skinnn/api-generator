<template>
<div class="helper-tooltip">
	<div @click="handleClick" class="helper-question-mark" :title="title">
		<span v-if="text" v-html="text"></span>
		<span v-else>?</span>
	</div>

	<div @click="handleClick" class="help-box">
		<transition :name="transition">
			<div v-if="showHelp" :class="['help-popover', position, {'popover-no-heading': !heading}]">
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
		onHover: { type: Boolean, default: true },
		position: { type: String, default: '' },
		heading: { type: [String, Number], default: null },
		text: { type: [String, Number], default: null },
		title: { type: String, default: '' },
		transition: { type: String, default: 'slide-fade' }
	},

	data() {
		return {
			showHelp: false,
			isHovering: false
		};
	},

	mounted() {
		if (this.onHover) {
			this.$el.addEventListener('mouseenter', this.handleHoverEnter);
			this.$el.addEventListener('mouseleave', this.handleHoverLeave);
		}
	},

	destroyed() {
		this.$el.removeEventListener('mouseenter', this.handleHoverEnter);
		this.$el.removeEventListener('mouseleave', this.handleHoverLeave);
	},

	methods: {
		handleClick() {
			this.showHelp = !this.showHelp;
		},

		handleHoverEnter() {
			this.showHelp = true;
			this.isHovering = true;
		},

		handleHoverLeave() {
			this.isHovering = false;
			setTimeout(() => {
				if (!this.isHovering) {
					this.showHelp = false;
				}
			}, 500);
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
	width: fit-content;
	// width: 18px;
	// height: 18px;
	padding: 4px 4px;
	margin-left: 5px;
	justify-content: center;
	align-items: center;
	// border-radius: 50%;
	user-select: none;
	font-size: 14px;
	background-color: lightgray;
	color: #fff;
	font-weight: 600;
	&:hover {
		cursor: pointer;
		background-color: rgb(189, 188, 188);
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

		&.top {
			top: -115px !important;
			left: -240px !important;
		}
		&.bottom {
			top: 15px !important;
			left: -260px !important;

			div.arrow {
				transform: translateX(290px) rotate(90deg) translateX(-29px);
			}
		}

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
			min-width: 330px;
			// max-width: 340px;
			color: grey;
			font-size: 13px;
			font-weight: 400;
			user-select: none;
			text-align: left;
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
