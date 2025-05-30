import React from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import { pdfStyles as styles } from "./ui/pdfStyles.tsx";

const upImageAddress = "https://up.edu.ph/wp-content/uploads/2020/01/UP-Seal.png";
const tin = "000-864-006-004";

export const UPLBHeader = () => {
  return (
    <View style={[styles.tableRow, { justifyContent: "center", alignItems: "center", position: "relative" }]}>
      <Image src={upImageAddress} style={styles.logo} />
      <View style={[styles.columnStack]}>
        <Text style={[styles.header]}>University of the Philippines</Text>
        <Text style={[styles.header, { fontSize: 14 }]}>LOS BANOS</Text>
        <Text style={styles.subText}>Los Banos, Laguna, IV-A</Text>
        <Text style={styles.subText}>
          TIN: <Text style={[styles.subText, { fontFamily: "Helvetica-Bold" }]}>{tin}</Text>
        </Text>
      </View>
    </View>
  );
};
