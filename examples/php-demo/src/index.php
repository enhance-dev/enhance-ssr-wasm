<?php

require __DIR__ . '/../vendor/autoload.php';

use Extism\Plugin;
use Extism\Manifest;
use Extism\PathWasmSource;

$start = microtime(true);
$wasm = new PathWasmSource(__DIR__ . "/../../wasm/dist/enhance-ssr.wasm");

$input = [
  "markup" => "<my-header>Hello World</my-header>",
  "elements" => [
    "my-header" => "function MyHeader({ html }) { return html`<h1><slot></slot></h1> ` }"
  ],
  "initialState" => []
];

$manifest = new Manifest($wasm);

$plugin = new Plugin($manifest, true);
$output = $plugin->call("ssr", json_encode($input));

$end = microtime(true);

echo "Time: " . ($end - $start) . "s\n";
echo "Input: " . $input["markup"] . "\n";
echo "Output: " . $output . "\n";
