<template>
    <div class="reg">
      <a href="/#/mine">X</a>
      <h1>注册</h1>
      <form action="http://localhost:1314/reg" method="post">
        <input type="text" name="username" placeholder="账号">
        <input type="password" name="password" placeholder="密码">
        <input type="submit" value="提交">
      </form>
    </div>
</template>

<script>
    export default {
        name: "Reg",

    }
</script>

<style>
</style>
