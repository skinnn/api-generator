<template>
	<footer>
		<div id="footer_subcont">
			<div class="copyright">&#169;2020 Vidoomy Media S.L</div>
			<div class="terms">Terms of service...</div>
			<div class="terms">Privacy policy...</div>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'DashboardFooter'
};
</script>

<style scoped lang="scss">
/**
 * Footer
 * ==================================================
 */

footer {
	display: flex;
  width: 100%;
  padding: 10px;
	height: 25px;
	align-self: flex-end;
	bottom: 0px;
	justify-content: flex-end;
}

#footer_subcont {
	display: flex;
	height: auto;
	align-self: stretch;
}
#footer_subcont div {
  color: $medium-grey;
  font-size: 0.8em;
}
/**
 * Footer end
 * ==================================================
 */
</style>