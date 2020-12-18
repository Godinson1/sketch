<?php 

function random_string($length){$key='';$keys=array_merge(range(0,9),range('a','z'));for($i=0;$i<$length;$i++){$key.=$keys[array_rand($keys)];}return $key;}

if($_SERVER['REQUEST_METHOD'] == 'POST')
{
   $post = file_get_contents('php://input');
   $json = json_decode($post, true);
   $filename = random_string(10);
   $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $json['upload_image']));
   $exported_file = $filename.".png";
   file_put_contents($_SERVER['DOCUMENT_ROOT'].'/sketch/images/'.$exported_file, $data);
//    echo $_SERVER['DOCUMENT_ROOT'].'/sketch/images/'.$exported_file;
}
else{ die('0'); }

?>