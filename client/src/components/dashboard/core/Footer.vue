<template>
	<footer>
		<div id="footer_subcont">
			<p class="copyright">Copyright &#169; 2020 Nikola Jovanovic</p>
			<p class="terms">Terms of service</p>
			<p class="terms">Privacy policy</p>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'DashboardFooter'
};
</script>

<style scoped lang="scss">
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
#footer_subcont p {
  color: $medium-grey;
  font-size: 0.8em;
}
</style>