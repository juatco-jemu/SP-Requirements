import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class NoOverflowScaffold extends StatelessWidget {
  final Widget? body;
  final List<Widget>? actions;
  final Widget? header;
  final EdgeInsetsGeometry padding;
  const NoOverflowScaffold({
    Key? key,
    required this.body,
    this.actions,
    this.header,
    this.padding = const EdgeInsets.all(8.0),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: InteractiveViewer(
          constrained: false,
          boundaryMargin: const EdgeInsets.all(double.infinity),
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: padding,
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: constraints.maxHeight,
                    minWidth: constraints.maxWidth,
                  ),
                  child: IntrinsicWidth(
                    child: IntrinsicHeight(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          if (header != null) Padding(padding: padding, child: header!),
                          if (actions != null)
                            Padding(
                                padding: padding,
                                child: OverflowBar(
                                  spacing: 8.0,
                                  overflowAlignment: OverflowBarAlignment.start,
                                  overflowDirection: VerticalDirection.down,
                                  children: actions!,
                                )),
                          Expanded(
                            child: Padding(padding: padding, child: body!),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
