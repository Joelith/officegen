/*
 MS Excel 2007 Creater v0.0.1
 Author : chuanyi.zheng@gmail.com
 History: 2012/11/07 first created
 */

;(function () {
  var ContentTypes
  var DocPropsApp
  var JSZip
  var SharedStrings
  var Sheet
  var Style
  var Workbook
  var XlRels
  var XlWorkbook
  var baseXl
  var tool
  var xml

  var bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments)
    }
  }

  JSZip = require('jszip')

  xml = require('xmlbuilder')

  tool = {
    i2a: function (i) {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123'.charAt(i - 1)
    }
  }

  ContentTypes = (function () {
    function ContentTypes(book) {
      this.book = book
    }

    ContentTypes.prototype.toxml = function () {
      var i, l, ref, types
      types = xml.create('Types', {
        version: '1.0',
        encoding: 'UTF-8',
        standalone: true
      })
      types.att(
        'xmlns',
        'http://schemas.openxmlformats.org/package/2006/content-types'
      )
      types.ele('Override', {
        PartName: '/xl/theme/theme1.xml',
        ContentType: 'application/vnd.openxmlformats-officedocument.theme+xml'
      })
      types.ele('Override', {
        PartName: '/xl/styles.xml',
        ContentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml'
      })
      types.ele('Default', {
        Extension: 'rels',
        ContentType: 'application/vnd.openxmlformats-package.relationships+xml'
      })
      types.ele('Default', {
        Extension: 'xml',
        ContentType: 'application/xml'
      })
      types.ele('Override', {
        PartName: '/xl/workbook.xml',
        ContentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'
      })
      types.ele('Override', {
        PartName: '/docProps/app.xml',
        ContentType:
          'application/vnd.openxmlformats-officedocument.extended-properties+xml'
      })
      for (
        i = l = 1, ref = this.book.sheets.length;
        ref >= 1 ? l <= ref : l >= ref;
        i = ref >= 1 ? ++l : --l
      ) {
        types.ele('Override', {
          PartName: '/xl/worksheets/sheet' + i + '.xml',
          ContentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml'
        })
      }
      types.ele('Override', {
        PartName: '/xl/sharedStrings.xml',
        ContentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml'
      })
      types.ele('Override', {
        PartName: '/docProps/core.xml',
        ContentType:
          'application/vnd.openxmlformats-package.core-properties+xml'
      })
      return types.end()
    }

    return ContentTypes
  })()

  DocPropsApp = (function () {
    function DocPropsApp(book) {
      this.book = book
    }

    DocPropsApp.prototype.toxml = function () {
      var i, l, props, ref, tmp
      props = xml.create('Properties', {
        version: '1.0',
        encoding: 'UTF-8',
        standalone: true
      })
      props.att(
        'xmlns',
        'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties'
      )
      props.att(
        'xmlns:vt',
        'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes'
      )
      props.ele('Application', 'Microsoft Excel')
      props.ele('DocSecurity', '0')
      props.ele('ScaleCrop', 'false')
      tmp = props.ele('HeadingPairs').ele('vt:vector', {
        size: 2,
        baseType: 'variant'
      })
      tmp.ele('vt:variant').ele('vt:lpstr', '工作表')
      tmp.ele('vt:variant').ele('vt:i4', '' + this.book.sheets.length)
      tmp = props.ele('TitlesOfParts').ele('vt:vector', {
        size: this.book.sheets.length,
        baseType: 'lpstr'
      })
      for (
        i = l = 1, ref = this.book.sheets.length;
        ref >= 1 ? l <= ref : l >= ref;
        i = ref >= 1 ? ++l : --l
      ) {
        tmp.ele('vt:lpstr', this.book.sheets[i - 1].name)
      }
      props.ele('Company')
      props.ele('LinksUpToDate', 'false')
      props.ele('SharedDoc', 'false')
      props.ele('HyperlinksChanged', 'false')
      props.ele('AppVersion', '12.0000')
      return props.end()
    }

    return DocPropsApp
  })()

  XlWorkbook = (function () {
    function XlWorkbook(book) {
      this.book = book
    }

    XlWorkbook.prototype.toxml = function () {
      var definedNames, i, l, ref, tmp, wb
      wb = xml.create('workbook', {
        version: '1.0',
        encoding: 'UTF-8',
        standalone: true
      })
      wb.att(
        'xmlns',
        'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
      )
      wb.att(
        'xmlns:r',
        'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
      )
      wb.ele('fileVersion', {
        appName: 'xl',
        lastEdited: '4',
        lowestEdited: '4',
        rupBuild: '4505'
      })
      wb.ele('workbookPr', {
        filterPrivacy: '1',
        defaultThemeVersion: '124226'
      })
      wb.ele('bookViews').ele('workbookView', {
        xWindow: '0',
        yWindow: '90',
        windowWidth: '19200',
        windowHeight: '11640'
      })
      tmp = wb.ele('sheets')
      for (
        i = l = 1, ref = this.book.sheets.length;
        ref >= 1 ? l <= ref : l >= ref;
        i = ref >= 1 ? ++l : --l
      ) {
        tmp.ele('sheet', {
          name: this.book.sheets[i - 1].name,
          sheetId: '' + i,
          'r:id': 'rId' + i
        })
      }
      definedNames = wb.ele('definedNames')
      this.book.sheets.forEach(function (sheet, idx) {
        if (sheet.autofilter) {
          return definedNames
            .ele('definedName', {
              name: '_xlnm._FilterDatabase',
              hidden: '1',
              localSheetId: idx
            })
            .raw("'" + sheet.name + "'!" + sheet.getRange())
        }
      })
      wb.ele('calcPr', {
        calcId: '124519'
      })
      return wb.end()
    }

    return XlWorkbook
  })()

  XlRels = (function () {
    function XlRels(book) {
      this.book = book
    }

    XlRels.prototype.toxml = function () {
      var i, l, ref, rs
      rs = xml.create('Relationships', {
        version: '1.0',
        encoding: 'UTF-8',
        standalone: true
      })
      rs.att(
        'xmlns',
        'http://schemas.openxmlformats.org/package/2006/relationships'
      )
      for (
        i = l = 1, ref = this.book.sheets.length;
        ref >= 1 ? l <= ref : l >= ref;
        i = ref >= 1 ? ++l : --l
      ) {
        rs.ele('Relationship', {
          Id: 'rId' + i,
          Type:
            'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet',
          Target: 'worksheets/sheet' + i + '.xml'
        })
      }
      rs.ele('Relationship', {
        Id: 'rId' + (this.book.sheets.length + 1),
        Type:
          'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme',
        Target: 'theme/theme1.xml'
      })
      rs.ele('Relationship', {
        Id: 'rId' + (this.book.sheets.length + 2),
        Type:
          'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles',
        Target: 'styles.xml'
      })
      rs.ele('Relationship', {
        Id: 'rId' + (this.book.sheets.length + 3),
        Type:
          'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings',
        Target: 'sharedStrings.xml'
      })
      return rs.end()
    }

    return XlRels
  })()

  SharedStrings = (function () {
    function SharedStrings() {
      this.cache = {}
      this.arr = []
    }

    SharedStrings.prototype.str2id = function (s) {
      var id
      id = this.cache[s]
      if (id) {
        return id
      } else {
        this.arr.push(s)
        this.cache[s] = this.arr.length
        return this.arr.length
      }
    }

    SharedStrings.prototype.toxml = function () {
      var i, l, ref, si, sst
      sst = xml.create('sst', {
        version: '1.0',
        encoding: 'UTF-8',
        standalone: true
      })
      sst.att(
        'xmlns',
        'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
      )
      sst.att('count', '' + this.arr.length)
      sst.att('uniqueCount', '' + this.arr.length)
      for (
        i = l = 0, ref = this.arr.length;
        ref >= 0 ? l < ref : l > ref;
        i = ref >= 0 ? ++l : --l
      ) {
        si = sst.ele('si')
        si.ele('t', this.arr[i])
        si.ele('phoneticPr', {
          fontId: 1,
          type: 'noConversion'
        })
      }
      return sst.end()
    }

    return SharedStrings
  })()

  Sheet = (function () {
    function Sheet(book, name1, cols1, rows1) {
      var i, j, l, n, ref, ref1
      this.book = book
      this.name = name1
      this.cols = cols1
      this.rows = rows1
      /* eslint-disable no-useless-escape */
      this.name = this.name.replace(/[\/*:?\[\]]/g, '-')
      this.data = {}
      for (
        i = l = 1, ref = this.rows;
        ref >= 1 ? l <= ref : l >= ref;
        i = ref >= 1 ? ++l : --l
      ) {
        this.data[i] = {}
        for (
          j = n = 1, ref1 = this.cols;
          ref1 >= 1 ? n <= ref1 : n >= ref1;
          j = ref1 >= 1 ? ++n : --n
        ) {
          this.data[i][j] = {
            v: 0
          }
        }
      }
      this.merges = []
      this.col_wd = []
      this.row_ht = {}
      this.styles = {}
    }

    Sheet.prototype.set = function (col, row, str) {
      if (typeof str === 'string') {
        if (str !== null && str !== '') {
          this.data[row][col].v = this.book.ss.str2id('' + str)
        }
        this.data[row][col].dataType = 'string'
        return this.data[row][col].dataType
      } else if (typeof str === 'number') {
        this.data[row][col].v = str
        this.data[row][col].dataType = 'number'
        return this.data[row][col].dataType
      } else {
        this.data[row][col].v = str
      }
    }

    Sheet.prototype.merge = function (from_cell, to_cell) {
      this.merges.push({
        from: from_cell,
        to: to_cell
      })

      return this.merges
    }

    Sheet.prototype.width = function (col, wd) {
      return this.col_wd.push({
        c: col,
        cw: wd
      })
    }

    Sheet.prototype.height = function (row, ht) {
      this.row_ht[row] = ht
      return this.row_ht[row]
    }

    Sheet.prototype.font = function (col, row, font_s) {
      this.styles['font_' + col + '_' + row] = this.book.st.font2id(font_s)
      return this.styles['font_' + col + '_' + row]
    }

    Sheet.prototype.fill = function (col, row, fill_s) {
      this.styles['fill_' + col + '_' + row] = this.book.st.fill2id(fill_s)
      return this.styles['fill_' + col + '_' + row]
    }

    Sheet.prototype.border = function (col, row, bder_s) {
      this.styles['bder_' + col + '_' + row] = this.book.st.bder2id(bder_s)
      return this.styles['bder_' + col + '_' + row]
    }

    Sheet.prototype.align = function (col, row, align_s) {
      this.styles['algn_' + col + '_' + row] = align_s
      return this.styles['algn_' + col + '_' + row]
    }

    Sheet.prototype.valign = function (col, row, valign_s) {
      this.styles['valgn_' + col + '_' + row] = valign_s
      return this.styles['valgn_' + col + '_' + row]
    }

    Sheet.prototype.rotate = function (col, row, textRotation) {
      this.styles['rotate_' + col + '_' + row] = textRotation
      return this.styles['rotate_' + col + '_' + row]
    }

    Sheet.prototype.wrap = function (col, row, wrap_s) {
      this.styles['wrap_' + col + '_' + row] = wrap_s
      return this.styles['wrap_' + col + '_' + row]
    }

    Sheet.prototype.autoFilter = function (filter_s) {
      this.autoFilter =
        typeof filter_s === 'string' ? filter_s : this.getRange()
      return this.autoFilter
    }

    Sheet.prototype.style_id = function (col, row) {
      var id, inx, style
      inx = '_' + col + '_' + row
      style = {
        font_id: this.styles['font' + inx],
        fill_id: this.styles['fill' + inx],
        bder_id: this.styles['bder' + inx],
        align: this.styles['algn' + inx],
        valign: this.styles['valgn' + inx],
        rotate: this.styles['rotate' + inx],
        wrap: this.styles['wrap' + inx]
      }
      id = this.book.st.style2id(style)
      return id
    }

    Sheet.prototype.getRange = function () {
      return '$A$1:$' + tool.i2a(this.cols) + '$' + this.rows
    }

    Sheet.prototype.toxml = function () {
      var c,
        cols,
        cw,
        ht,
        i,
        ix,
        j,
        l,
        len,
        len1,
        m,
        mc,
        n,
        p,
        q,
        r,
        ref,
        ref1,
        ref2,
        ref3,
        sd,
        sid,
        ws
      ws = xml.create('worksheet', {
        version: '1.0',
        encoding: 'UTF-8',
        standalone: true
      })
      ws.att(
        'xmlns',
        'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
      )
      ws.att(
        'xmlns:r',
        'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
      )
      ws.ele('dimension', {
        ref: 'A1'
      })
      ws.ele('sheetViews').ele('sheetView', {
        workbookViewId: '0'
      })
      ws.ele('sheetFormatPr', {
        defaultRowHeight: '13.5'
      })
      if (this.col_wd.length > 0) {
        cols = ws.ele('cols')
        ref = this.col_wd
        for (l = 0, len = ref.length; l < len; l++) {
          cw = ref[l]
          cols.ele('col', {
            min: '' + cw.c,
            max: '' + cw.c,
            width: cw.cw,
            customWidth: '1'
          })
        }
      }
      sd = ws.ele('sheetData')
      for (
        i = n = 1, ref1 = this.rows;
        ref1 >= 1 ? n <= ref1 : n >= ref1;
        i = ref1 >= 1 ? ++n : --n
      ) {
        r = sd.ele('row', {
          r: '' + i,
          spans: '1:' + this.cols
        })
        ht = this.row_ht[i]
        if (ht) {
          r.att('ht', ht)
          r.att('customHeight', '1')
        }
        for (
          j = p = 1, ref2 = this.cols;
          ref2 >= 1 ? p <= ref2 : p >= ref2;
          j = ref2 >= 1 ? ++p : --p
        ) {
          ix = this.data[i][j]
          sid = this.style_id(j, i)
          if ((ix.v !== null && ix.v !== 0) || sid !== 1) {
            c = r.ele('c', {
              r: '' + tool.i2a(j) + i
            })
            if (sid !== 1) {
              c.att('s', '' + (sid - 1))
            }
            if (ix.dataType === 'string') {
              c.att('t', 's')
              c.ele('v', '' + (ix.v - 1))
            } else if (ix.dataType === 'number') {
              c.ele('v', '' + ix.v)
            }
          }
        }
      }
      if (this.merges.length > 0) {
        mc = ws.ele('mergeCells', {
          count: this.merges.length
        })
        ref3 = this.merges
        for (q = 0, len1 = ref3.length; q < len1; q++) {
          m = ref3[q]
          mc.ele('mergeCell', {
            ref:
              '' +
              tool.i2a(m.from.col) +
              m.from.row +
              ':' +
              tool.i2a(m.to.col) +
              m.to.row
          })
        }
      }
      if (typeof this.autoFilter === 'string') {
        ws.ele('autoFilter', {
          ref: this.autoFilter
        })
      }
      ws.ele('phoneticPr', {
        fontId: '1',
        type: 'noConversion'
      })
      ws.ele('pageMargins', {
        left: '0.7',
        right: '0.7',
        top: '0.75',
        bottom: '0.75',
        header: '0.3',
        footer: '0.3'
      })
      ws.ele('pageSetup', {
        paperSize: '9',
        orientation: 'portrait',
        horizontalDpi: '200',
        verticalDpi: '200'
      })
      return ws.end()
    }

    return Sheet
  })()

  Style = (function () {
    function Style(book) {
      this.book = book
      this.cache = {}
      this.mfonts = []
      this.mfills = []
      this.mbders = []
      this.mstyle = []
      this.with_default()
    }

    Style.prototype.with_default = function () {
      this.def_font_id = this.font2id(null)
      this.def_fill_id = this.fill2id(null)
      this.def_bder_id = this.bder2id(null)
      this.def_align = '-'
      this.def_valign = '-'
      this.def_rotate = '-'
      this.def_wrap = '-'
      this.def_style_id = this.style2id({
        font_id: this.def_font_id,
        fill_id: this.def_fill_id,
        bder_id: this.def_bder_id,
        align: this.def_align,
        valign: this.def_valign,
        rotate: this.def_rotate
      })

      return this.def_style_id
    }

    Style.prototype.font2id = function (font) {
      var id, k
      font || (font = {})
      font.bold || (font.bold = '-')
      font.iter || (font.iter = '-')
      font.sz || (font.sz = '11')
      font.color || (font.color = '-')
      font.name || (font.name = '宋体')
      font.scheme || (font.scheme = 'minor')
      font.family || (font.family = '2')
      k =
        'font_' +
        font.bold +
        font.iter +
        font.sz +
        font.color +
        font.name +
        font.scheme +
        font.family
      id = this.cache[k]
      if (id) {
        return id
      } else {
        this.mfonts.push(font)
        this.cache[k] = this.mfonts.length
        return this.mfonts.length
      }
    }

    Style.prototype.fill2id = function (fill) {
      var id, k
      fill || (fill = {})
      fill.type || (fill.type = 'none')
      fill.bgColor || (fill.bgColor = '-')
      fill.fgColor || (fill.fgColor = '-')
      k = 'fill_' + fill.type + fill.bgColor + fill.fgColor
      id = this.cache[k]
      if (id) {
        return id
      } else {
        this.mfills.push(fill)
        this.cache[k] = this.mfills.length
        return this.mfills.length
      }
    }

    Style.prototype.bder2id = function (bder) {
      var id, k
      bder || (bder = {})
      bder.left || (bder.left = '-')
      bder.right || (bder.right = '-')
      bder.top || (bder.top = '-')
      bder.bottom || (bder.bottom = '-')
      k =
        'bder_' +
        bder.left +
        '_' +
        bder.right +
        '_' +
        bder.top +
        '_' +
        bder.bottom
      id = this.cache[k]
      if (id) {
        return id
      } else {
        this.mbders.push(bder)
        this.cache[k] = this.mbders.length
        return this.mbders.length
      }
    }

    Style.prototype.style2id = function (style) {
      var id, k
      style.align || (style.align = this.def_align)
      style.valign || (style.valign = this.def_valign)
      style.rotate || (style.rotate = this.def_rotate)
      style.wrap || (style.wrap = this.def_wrap)
      style.font_id || (style.font_id = this.def_font_id)
      style.fill_id || (style.fill_id = this.def_fill_id)
      style.bder_id || (style.bder_id = this.def_bder_id)
      k =
        's_' +
        style.font_id +
        '_' +
        style.fill_id +
        '_' +
        style.bder_id +
        '_' +
        style.align +
        '_' +
        style.valign +
        '_' +
        style.wrap +
        '_' +
        style.rotate
      id = this.cache[k]
      if (id) {
        return id
      } else {
        this.mstyle.push(style)
        this.cache[k] = this.mstyle.length
        return this.mstyle.length
      }
    }

    Style.prototype.toxml = function () {
      var bders,
        cs,
        e,
        ea,
        es,
        fills,
        fonts,
        l,
        len,
        len1,
        len2,
        len3,
        n,
        o,
        p,
        q,
        ref,
        ref1,
        ref2,
        ref3,
        ss
      ss = xml.create('styleSheet', {
        version: '1.0',
        encoding: 'UTF-8',
        standalone: true
      })
      ss.att(
        'xmlns',
        'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
      )
      fonts = ss.ele('fonts', {
        count: this.mfonts.length
      })
      ref = this.mfonts
      for (l = 0, len = ref.length; l < len; l++) {
        o = ref[l]
        e = fonts.ele('font')
        if (o.bold !== '-') {
          e.ele('b')
        }
        if (o.iter !== '-') {
          e.ele('i')
        }
        e.ele('sz', {
          val: o.sz
        })
        if (o.color !== '-') {
          e.ele('color', {
            rgb: o.color
          })
        }
        e.ele('name', {
          val: o.name
        })
        e.ele('family', {
          val: o.family
        })
        e.ele('charset', {
          val: '134'
        })
        if (o.scheme !== '-') {
          e.ele('scheme', {
            val: 'minor'
          })
        }
      }
      fills = ss.ele('fills', {
        count: this.mfills.length + 2
      })
      fills.ele('fill').ele('patternFill', {
        patternType: 'none'
      })
      fills.ele('fill').ele('patternFill', {
        patternType: 'gray125'
      })
      ref1 = this.mfills
      for (n = 0, len1 = ref1.length; n < len1; n++) {
        o = ref1[n]
        e = fills.ele('fill')
        es = e.ele('patternFill', {
          patternType: o.type
        })
        if (o.fgColor !== '-') {
          es.ele('fgColor', {
            rgb: o.fgColor
          })
        }
        if (o.bgColor !== '-') {
          es.ele('bgColor', {
            indexed: o.bgColor
          })
        }
      }
      bders = ss.ele('borders', {
        count: this.mbders.length
      })
      ref2 = this.mbders
      for (p = 0, len2 = ref2.length; p < len2; p++) {
        o = ref2[p]
        e = bders.ele('border')
        if (o.left !== '-') {
          e.ele('left', {
            style: o.left
          }).ele('color', {
            auto: '1'
          })
        } else {
          e.ele('left')
        }
        if (o.right !== '-') {
          e.ele('right', {
            style: o.right
          }).ele('color', {
            auto: '1'
          })
        } else {
          e.ele('right')
        }
        if (o.top !== '-') {
          e.ele('top', {
            style: o.top
          }).ele('color', {
            auto: '1'
          })
        } else {
          e.ele('top')
        }
        if (o.bottom !== '-') {
          e.ele('bottom', {
            style: o.bottom
          }).ele('color', {
            auto: '1'
          })
        } else {
          e.ele('bottom')
        }
        e.ele('diagonal')
      }
      ss.ele('cellStyleXfs', {
        count: '1'
      })
        .ele('xf', {
          numFmtId: '0',
          fontId: '0',
          fillId: '0',
          borderId: '0'
        })
        .ele('alignment', {
          vertical: 'center'
        })
      cs = ss.ele('cellXfs', {
        count: this.mstyle.length
      })
      ref3 = this.mstyle
      for (q = 0, len3 = ref3.length; q < len3; q++) {
        o = ref3[q]
        e = cs.ele('xf', {
          numFmtId: '0',
          fontId: o.font_id - 1,
          fillId: o.fill_id + 1,
          borderId: o.bder_id - 1,
          xfId: '0'
        })
        if (o.font_id !== 1) {
          e.att('applyFont', '1')
        }
        if (o.fill_id !== 1) {
          e.att('applyFill', '1')
        }
        if (o.bder_id !== 1) {
          e.att('applyBorder', '1')
        }
        if (o.align !== '-' || o.valign !== '-' || o.wrap !== '-') {
          e.att('applyAlignment', '1')
          ea = e.ele('alignment', {
            textRotation: o.rotate === '-' ? '0' : o.rotate,
            horizontal: o.align === '-' ? 'left' : o.align,
            vertical: o.valign === '-' ? 'top' : o.valign
          })
          if (o.wrap !== '-') {
            ea.att('wrapText', '1')
          }
        }
      }
      ss.ele('cellStyles', {
        count: '1'
      }).ele('cellStyle', {
        name: '常规',
        xfId: '0',
        builtinId: '0'
      })
      ss.ele('dxfs', {
        count: '0'
      })
      ss.ele('tableStyles', {
        count: '0',
        defaultTableStyle: 'TableStyleMedium9',
        defaultPivotStyle: 'PivotStyleLight16'
      })
      return ss.end()
    }

    return Style
  })()

  Workbook = (function () {
    function Workbook(fpath1, fname1) {
      this.fpath = fpath1
      this.fname = fname1
      this.generate = bind(this.generate, this)
      this.save = bind(this.save, this)
      this.id = '' + parseInt(Math.random() * 9999999)
      this.sheets = []
      this.ss = new SharedStrings()
      this.ct = new ContentTypes(this)
      this.da = new DocPropsApp(this)
      this.wb = new XlWorkbook(this)
      this.re = new XlRels(this)
      this.st = new Style(this)
    }

    Workbook.prototype.createSheet = function (name, cols, rows) {
      var sheet
      sheet = new Sheet(this, name, cols, rows)
      this.sheets.push(sheet)
      return sheet
    }

    Workbook.prototype.save = function (cb) {
      var target
      target = this.fpath + '/' + this.fname
      return this.generate(function (err, zip) {
        if (err) {
          cb(err)
        } // Endif.

        zip
          .generateAsync({
            type: 'nodebuffer'
          })
          .then(function (buffer) {
            return require('fs').writeFile(target, buffer, cb)
          })
          .catch(function (err) {
            cb(err)
          })
      })
    }

    Workbook.prototype.generate = function (cb) {
      var i, key, l, ref, zip
      zip = new JSZip()
      for (key in baseXl) {
        zip.file(key, baseXl[key])
      }
      zip.file('[Content_Types].xml', this.ct.toxml())
      zip.file('docProps/app.xml', this.da.toxml())
      zip.file('xl/workbook.xml', this.wb.toxml())
      zip.file('xl/sharedStrings.xml', this.ss.toxml())
      zip.file('xl/_rels/workbook.xml.rels', this.re.toxml())
      for (
        i = l = 0, ref = this.sheets.length;
        ref >= 0 ? l < ref : l > ref;
        i = ref >= 0 ? ++l : --l
      ) {
        zip.file(
          'xl/worksheets/sheet' + (i + 1) + '.xml',
          this.sheets[i].toxml()
        )
      }
      zip.file('xl/styles.xml', this.st.toxml())
      return cb(null, zip)
    }

    Workbook.prototype.cancel = function () {
      return console.error('workbook.cancel() is deprecated')
    }

    return Workbook
  })()

  module.exports = {
    createWorkbook: function (fpath, fname) {
      return new Workbook(fpath, fname)
    }
  }

  baseXl = {
    '_rels/.rels':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'docProps/core.xml':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Administrator</dc:creator><cp:lastModifiedBy></cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2006-09-13T11:21:51Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2006-09-13T11:21:55Z</dcterms:modified></cp:coreProperties>',
    'xl/theme/theme1.xml':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office 主题"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:shade val="93000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>',
    'xl/styles.xml':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><color theme="1"/><name val="宋体"/><family val="2"/><charset val="134"/><scheme val="minor"/></font><font><sz val="9"/><name val="宋体"/><family val="2"/><charset val="134"/><scheme val="minor"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"><alignment vertical="center"/></xf></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="常规" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16"/></styleSheet>'
  }
}.call(this))