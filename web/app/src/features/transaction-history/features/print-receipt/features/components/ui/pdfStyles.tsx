import { StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Libre Baskerville",
  fonts: [
    { src: "https://fonts.gstatic.com/s/librebaskerville/v16/kmKnZrc3Hgbbcjq75U4uslyuy4kn0pNeKSZpZRpEPiU.ttf" }, // Regular
    {
      src: "https://fonts.gstatic.com/s/librebaskerville/v16/kmKiZrc3Hgbbcjq75U4uslyuy4kn0pNeKcZZQzBDPiU.ttf",
      fontWeight: "bold",
    }, // Bold
    {
      src: "https://fonts.gstatic.com/s/librebaskerville/v16/kmKiZrc3Hgbbcjq75U4uslyuy4kn0pNeKe5aQzBDPiU.ttf",
      fontStyle: "italic",
    }, // Italic
  ],
});

export const pdfStyles = StyleSheet.create({
  libreText: {
    fontFamily: "Libre Baskerville",
  },
  logo: {
    position: "absolute",
    height: 70,
    width: 75,
    aspectRatio: 1,
    left: 205,
  },
  subText: {
    fontSize: 11,
  },
  text: {
    fontSize: 12,
  },
  page: {
    flexDirection: "column",
    padding: 20,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  subheader: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
  },
  table: {
    display: "flex",
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    padding: 5,
    border: "1px solid black",
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  footer: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 20,
  },
  nameLabel: {
    marginTop: 5,
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  columnStack: {
    margin: 5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  boldTableCell: {
    padding: 5,
    border: "1px solid black",
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  signatureBlock: {
    alignItems: "center",
    marginLeft: "auto",
    marginRight: 40,
  },
  AOBlock: {
    marginTop: 20,
    alignItems: "center",
    marginLeft: 40,
    marginRight: "auto",
  },
});
