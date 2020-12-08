#include <zbar.h>
#include <stdio.h>
#include <stdlib.h>

typedef int int32_t;
typedef unsigned int uint32_t;


__attribute__((export_name("malloc")))
void *zmalloc(size_t t) {
  return malloc(t);
}

__attribute__((export_name("free")))
void zfree(void *p) {
  free(p);
}

__attribute__((export_name("ImageScanner_create")))
zbar_image_scanner_t* ImageScanner_create() {
  return zbar_image_scanner_create();
}

__attribute__((export_name("ImageScanner_destroy")))
void ImageScanner_destroy(zbar_image_scanner_t* scanner) {
  zbar_image_scanner_destroy(scanner);
}

__attribute__((export_name("ImageScanner_set_config")))
int ImageScanner_set_config(zbar_image_scanner_t* scanner,
                                   int32_t symbology,
                                   int32_t config,
                                   int32_t value) {
  return zbar_image_scanner_set_config(scanner, (zbar_symbol_type_t)(symbology),
                                       (zbar_config_t)(config), value);
}

__attribute__((export_name("ImageScanner_enable_cache")))
void ImageScanner_enable_cache(zbar_image_scanner_t* scanner,
                                      int enable) {
  zbar_image_scanner_enable_cache(scanner, enable);
}

__attribute__((export_name("ImageScanner_recycle_image")))
void ImageScanner_recycle_image(zbar_image_scanner_t* scanner,
                                       zbar_image_t* image) {
  zbar_image_scanner_recycle_image(scanner, image);
}

__attribute__((export_name("ImageScanner_get_results")))
const zbar_symbol_set_t* ImageScanner_get_results(
    zbar_image_scanner_t* scanner) {
  return zbar_image_scanner_get_results(scanner);
}

__attribute__((export_name("ImageScanner_first_symbol")))
const zbar_symbol_t* ImageScanner_first_symbol(
    zbar_image_t *image) {
  return zbar_image_first_symbol(image);
}

__attribute__((export_name("ImageScanner_next_symbol")))
const zbar_symbol_t* ImageScanner_next_symbol(
    zbar_symbol_t *symbol) {
  return zbar_symbol_next(symbol);
}

__attribute__((export_name("ImageScanner_get_data")))
const char* ImageScanner_get_data(
    zbar_symbol_t *symbol) {
  return zbar_symbol_get_data(symbol);
}

__attribute__((export_name("ImageScanner_scan")))
int ImageScanner_scan(zbar_image_scanner_t* scanner,
                             zbar_image_t* image) {
  return zbar_scan_image(scanner, image);
}

__attribute__((export_name("Image_create")))
zbar_image_t* Image_create(uint32_t width,
                                  uint32_t height,
                                  uint32_t format,
                                  void* data,
                                  uint32_t length,
                                  uint32_t sequence_num) {
  zbar_image_t* image = zbar_image_create();
  zbar_image_set_size(image, width, height);
  zbar_image_set_format(image, format);
  zbar_image_set_data(image, data, length, zbar_image_free_data);
  zbar_image_set_sequence(image, sequence_num);
  return image;
}

__attribute__((export_name("Image_destroy")))
void Image_destroy(zbar_image_t* image) {
  zbar_image_destroy(image);
}

__attribute__((export_name("Image_get_symbols")))
const zbar_symbol_set_t* Image_get_symbols(zbar_image_t* image) {
  return zbar_image_get_symbols(image);
}
