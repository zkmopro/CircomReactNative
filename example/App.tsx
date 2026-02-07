import { Image, StyleSheet, Button, TextInput, View, Text, Platform, ScrollView } from "react-native";

import MoproReactNativePackage, {
    Result,
    circomProve,
    CircomProofResult,
    verifyCircomProof,
    CircomProof,
    CircomProofLib,
    ProofLibOption,
} from "mopro-react-native-package";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { Asset } from "expo-asset";

export default function HomeScreen() {
    const [a, setA] = useState("3");
    const [b, setB] = useState("4");
    const [inputs, setInputs] = useState<string[]>([]);
    const [proof, setProof] = useState<CircomProof>({
        a: { x: "", y: "", z: "" },
        b: { x: [], y: [], z: [] },
        c: { x: "", y: "", z: "" },
        protocol: "",
        curve: "",
    });
    const [isValid, setIsValid] = useState<string>("");

    async function genProof(): Promise<void> {
        const circuitInputs = {
            a: [a],
            b: [b],
        };
        if (Platform.OS === "android" || Platform.OS === "ios") {
            const zkeyFileName = "multiplier2_final.zkey";
            const graphFileName = "multiplier2.bin";
            const zkeyAsset = Asset.fromModule(
                require(`./assets/${zkeyFileName}`)
            );
            const graphAsset = Asset.fromModule(
                require(`./assets/${graphFileName}`)
            );
            const zkeyFilePath = `${FileSystem.documentDirectory}${zkeyFileName}`;
            const graphFilePath = `${FileSystem.documentDirectory}${graphFileName}`;
            const zkeyFileInfo = await FileSystem.getInfoAsync(zkeyFilePath);
            const graphFileInfo = await FileSystem.getInfoAsync(graphFilePath);
            if (!zkeyFileInfo.exists) {
                const zkeyFile = await zkeyAsset.downloadAsync();
                if (zkeyFile.localUri === null) {
                    throw new Error("Failed to download the file");
                }
                try {
                    await FileSystem.moveAsync({
                        from: zkeyFile.localUri,
                        to: zkeyFilePath,
                    });
                } catch (error) {
                    console.error("Error renaming the file:", error);
                }
            }

            if (!graphFileInfo.exists) {
                const graphFile = await graphAsset.downloadAsync();
                if (graphFile.localUri === null) {
                    throw new Error("Failed to download the file");
                }
                try {
                    await FileSystem.moveAsync({
                        from: graphFile.localUri,
                        to: graphFilePath,
                    });
                } catch (error) {
                    console.error("Error renaming the file:", error);
                }
            }

            try {
                // DO NOT change the proofLib if you don't build for rapidsnark
                const res: CircomProofResult = await MoproReactNativePackage.circomProve(
                    graphFilePath.replace("file://", ""),
                    JSON.stringify(circuitInputs),
                    zkeyFilePath.replace("file://", ""),
                );
                setProof(res.proof);
                setInputs(res.inputs);
            } catch (error) {
                console.error("Error generating proof:", error);
            }
        }
    }

    async function verifyProof(): Promise<void> {
        if (Platform.OS === "web") {
            setIsValid("not implemented");
        } else if (Platform.OS === "android" || Platform.OS === "ios") {
            const newFileName = "multiplier2_final.zkey";
            const asset = Asset.fromModule(
                require(`./assets/${newFileName}`)
            );
            const newFilePath = `${FileSystem.documentDirectory}${newFileName}`;
            const fileInfo = await FileSystem.getInfoAsync(newFilePath);
            if (!fileInfo.exists) {
                const file = await asset.downloadAsync();
                if (file.localUri === null) {
                    throw new Error("Failed to download the file");
                }
                try {
                    await FileSystem.moveAsync({
                        from: file.localUri,
                        to: newFilePath,
                    });
                } catch (error) {
                    console.error("Error renaming the file:", error);
                }
            }

            try {
                const circomProofResult: CircomProofResult = {
                    proof: proof,
                    inputs: inputs,
                };
                // DO NOT change the proofLib if you don't build for rapidsnark
                const proofLib: CircomProofLib = {
                    proofLib: ProofLibOption.Arkworks,
                };
                const res: boolean = await MoproReactNativePackage.verifyCircomProof(
                    newFilePath.replace("file://", ""),
                    circomProofResult,
                    proofLib
                );
                setIsValid(res.toString());
            } catch (error) {
                console.error("Error verifying proof:", error);
            }
        }
    }

    return (
        <View style={styles.proofContainer} testID="proof-container">
            <View style={styles.inputContainer}>
                <Text style={styles.label}>a</Text>
                <TextInput
                    testID="input-a"
                    style={styles.input}
                    placeholder="Enter value for a"
                    value={a}
                    onChangeText={setA}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>b</Text>
                <TextInput
                    testID="input-b"
                    style={styles.input}
                    placeholder="Enter value for b"
                    value={b}
                    onChangeText={setB}
                    keyboardType="numeric"
                />
            </View>
            <Button
                testID="gen-proof-button"
                title="Generate Circom Proof"
                onPress={() => genProof()}
            />
            <Button
                testID="verify-proof-button"
                title="Verify Circom Proof"
                onPress={() => verifyProof()}
            />
            <View style={styles.stepContainer}>
                <Text >Proof is Valid:</Text>
                <Text testID="valid-output" style={styles.output}>
                    {isValid}
                </Text>
                <Text >Public Signals:</Text>
                <ScrollView style={styles.outputScroll}>
                    <Text testID="inputs-output" style={styles.output}>
                        {JSON.stringify(inputs)}
                    </Text>
                </ScrollView>
                <Text >Proof:</Text>
                <ScrollView style={styles.outputScroll}>
                    <Text testID="proof-output" style={styles.output}>
                        {JSON.stringify(proof)}
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        flex: 1,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginRight: 10,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
    outputScroll: {
        maxHeight: 150,
        borderWidth: 1,
        borderColor: "gray",
        marginBottom: 10,
    },
    output: {
        fontSize: 14,
        padding: 10,
    },
    tabContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        padding: 15,
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#ccc",
    },
    activeTab: {
        borderBottomColor: "#A1CEDC",
    },
    tabText: {
        fontSize: 16,
        fontWeight: "500",
    },
    proofContainer: {
        padding: 10,
    },
});
