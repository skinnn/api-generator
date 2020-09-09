<template>
	<footer>
		<div id="footer-container">
			<p class="copyright">Copyright &#169; 2020 Nikola Jovanovic</p>
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

#footer-container {
	display: flex;
	height: auto;
	align-self: stretch;
}
#footer-container p {
  color: $medium-grey;
  font-size: 0.8em;
}
</style>