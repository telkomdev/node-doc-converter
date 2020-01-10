## Docx to PDF converter "running on top of LibreOffice Headless"

### Running

build docker image
```shell
$ make build
```

run docker image
```shell
$ docker run --rm -p 9000:9000 docxtopdf
```

Visit http://localhost:9000/