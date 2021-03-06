package com.anjz.util.pdf;

import java.io.IOException;

import com.lowagie.text.*;
import com.lowagie.text.pdf.BaseFont;

/**
 * pdf段落字体设置
 * 
 * @author ding.shuai
 * @date 2016年7月31日下午4:30:14
 */
public class PdfParagraph extends Paragraph {
	private static final long serialVersionUID = -244970043180837974L;

	public PdfParagraph(String content) {
		super(content, getChineseFont(12, false));
	}

	public PdfParagraph(String content, int fontSize, boolean isBold) {
		super(content, getChineseFont(fontSize, isBold));
	}

	// 设置字体-返回中文字体
	protected static Font getChineseFont(int nfontsize, boolean isBold) {
		BaseFont bfChinese;
		Font fontChinese = null;
		try {
			bfChinese = BaseFont.createFont(PdfParagraph.class.getResource("") + "simsun.ttc,1", BaseFont.IDENTITY_H,
					BaseFont.EMBEDDED);
			if (isBold) {
				fontChinese = new Font(bfChinese, nfontsize, Font.BOLD);
			} else {
				fontChinese = new Font(bfChinese, nfontsize, Font.NORMAL);
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return fontChinese;
	}

	// 转化中文
	protected Cell ChangeCell(String str, int nfontsize, boolean isBold)
			throws IOException, BadElementException, DocumentException {
		Phrase ph = ChangeChinese(str, nfontsize, isBold);
		Cell cell = new Cell(ph);
		// cell.setBorderWidth(3);

		return cell;
	}

	// 转化中文
	protected Chunk ChangeChunk(String str, int nfontsize, boolean isBold)
			throws IOException, BadElementException, DocumentException {
		Font FontChinese = getChineseFont(nfontsize, isBold);
		Chunk chunk = new Chunk(str, FontChinese);
		return chunk;
	}

	// 转化中文（返回短语）
	protected Phrase ChangeChinese(String str, int nfontsize, boolean isBold)
			throws IOException, BadElementException, DocumentException {
		Font FontChinese = getChineseFont(nfontsize, isBold);
		Phrase ph = new Phrase(str, FontChinese);
		return ph;
	}
}
