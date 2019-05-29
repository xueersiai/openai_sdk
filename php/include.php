<?php
// >= php 5.3.0，低版本的php需手动include SDK文件夹的所有文件
spl_autoload_register(function ($class) {
    include_once("./lib/{$class}.php");
});
